package utils

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"time"

	sssa "github.com/jwayong/sssa-golang"
	_ "github.com/lib/pq"
)

const MIN_SHARES = 3
const TOTAL_SHARES = 5
const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbpwd  = "postgres"
	dbname = "postgres"
)

type Pwd_details struct {
	User_id       int
	Total_shards  int
	Min_shard     int
	Original_pwd  string
	Shardno_in_az int
}

type Secretrecord struct {
	User_id  int    `json:"userid"`
	Shard_no int    `json:"shardno"`
	Shard    string `json:"shard"`
}

func (pwd_details *Pwd_details) StorePWD() error {
	if pwd_details.User_id <= 0 || len(pwd_details.Original_pwd) == 0 {
		return errors.New("Cant proceed invalid size")
	}
	// This wil create the shares
	sharesssa, err := sssa.Create(pwd_details.Min_shard, pwd_details.Total_shards, pwd_details.Original_pwd)
	if err != nil {
		return err
	}
	// as of now print it
	fmt.Println(sharesssa)
	// Now add the database logic
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, dbpwd, dbname)
	//fmt.Println(connStr)
	db, err1 := sql.Open("postgres", connStr)
	if err1 != nil {
		return err1
	}
	defer db.Close()
	// This will generate a random number between min and max shards to be stored in secret
	rand.Seed(time.Now().UnixNano())
	pwd_details.Shardno_in_az = rand.Intn(pwd_details.Total_shards-1) + 1
	sqlStatement := `INSERT INTO PWD_DETAILS (user_id,SHARD_GEN,MIN_SHARD,ORIGINAL_PWD,SHARDNo_In_AZ) VALUES ($1, $2, $3, $4,$5)`
	_, err = db.Exec(sqlStatement, pwd_details.User_id, pwd_details.Total_shards, pwd_details.Min_shard, pwd_details.Original_pwd, pwd_details.Shardno_in_az)
	if err != nil {
		panic(err)
	}
	// insert teh shards into the second stable

	for _, shard := range sharesssa {
		sqlStatement = `INSERT INTO PWDS (user_id,PASSWORD) VALUES ($1, $2)`
		_, err = db.Exec(sqlStatement, pwd_details.User_id, shard)
		if err != nil {
			panic(err)
		}
	}
	// Store the shard into secret using the REST API
	var secret Secretrecord
	secret.User_id = pwd_details.User_id
	secret.Shard_no = pwd_details.Shardno_in_az
	secret.Shard = sharesssa[secret.Shard_no-1]
	recBytes, _ := json.MarshalIndent(secret, "", "\t")
	resp, err := http.Post("http://localhost:9091/secret/post", "application/json", bytes.NewBuffer(recBytes))
	defer resp.Body.Close()
	return nil
}

// ..Retrieving PWD
func (pwd_details *Pwd_details) DecryptPWD(shard []string) (string, error) {
	if pwd_details.User_id <= 0 || len(shard) == 0 {
		return "", errors.New("invalid size")
	}
	// get teh details from PWD_DETAILS
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, dbpwd, dbname)
	db, err1 := sql.Open("postgres", connStr)
	if err1 != nil {
		return "", err1
	}
	defer db.Close()

	sqlStatement := fmt.Sprintf("SELECT * from PWD_DETAILS where user_id=%d", pwd_details.User_id)
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return "", nil
	}
	//var pwd_det pwd_details
	for rows.Next() {
		if err := rows.Scan(&pwd_details.User_id, &pwd_details.Total_shards, &pwd_details.Min_shard, &pwd_details.Original_pwd, &pwd_details.Shardno_in_az); err != nil {
			return "", err
		}
	}
	// Now check if the shards sent is equal to the minimal shard required
	if len(shard) != (pwd_details.Min_shard - 1) {
		return "", errors.New("Invalid no of Shards")
	}
	// Get the shard from the secret
	url := fmt.Sprintf("http://localhost:9091/secret/get/%d", pwd_details.User_id)
	resp, err := http.Get(url)

	defer resp.Body.Close()
	recBytes, _ := ioutil.ReadAll(resp.Body)

	//bodyString := string(recBytes)

	var secret Secretrecord
	json.Unmarshal(recBytes, &secret)

	// use the shards and decrypt
	shard = append(shard, secret.Shard)
	secretstring, err := sssa.Combine(shard)
	if err != nil {
		return "", err
	}
	fmt.Println(secretstring)
	return secretstring, nil

}
