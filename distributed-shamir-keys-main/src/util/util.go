package util

import (
	"database/sql"
	"errors"
	"fmt"

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

type pwd_details struct {
	user_id      int
	total_shards int
	min_shard    int
	original_pwd string
}

func GenerateShard(id int, password string) error {
	if id <= 0 || len(password) == 0 {
		return errors.New("invalid size")
	}
	// This wil create the shares
	sharesssa, err := sssa.Create(MIN_SHARES, TOTAL_SHARES, password)
	if err != nil {
		return err
	}
	// as of now print it
	fmt.Println(sharesssa)
	// Now add the database logic
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, dbpwd, dbname)
	fmt.Println(connStr)
	db, err1 := sql.Open("postgres", connStr)
	if err1 != nil {
		return err1
	}
	defer db.Close()
	sqlStatement := `INSERT INTO PWD_DETAILS (user_id,SHARD_GEN,MIN_SHARD,ORIGINAL_PWD) VALUES ($1, $2, $3, $4)`
	_, err = db.Exec(sqlStatement, id, TOTAL_SHARES, MIN_SHARES, password)
	if err != nil {
		panic(err)
	}
	// insert teh shards into the second stable

	for _, shard := range sharesssa {
		sqlStatement = `INSERT INTO PWDS (user_id,PASSWORD) VALUES ($1, $2)`
		_, err = db.Exec(sqlStatement, id, shard)
		if err != nil {
			panic(err)
		}
	}
	return nil
}

func DecryptShard(user_id int, shard []string) (string, error) {
	if user_id <= 0 || len(shard) == 0 {
		return "", errors.New("invalid size")
	}
	// get teh details from PWD_DETAILS
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, dbpwd, dbname)
	db, err1 := sql.Open("postgres", connStr)
	if err1 != nil {
		return "", err1
	}
	defer db.Close()

	sqlStatement := fmt.Sprintf("SELECT * from PWD_DETAILS where user_id=%d", user_id)
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return "", nil
	}
	var pwd_det pwd_details
	for rows.Next() {
		if err := rows.Scan(&pwd_det.user_id, &pwd_det.total_shards, &pwd_det.min_shard, &pwd_det.original_pwd); err != nil {
			return "", err
		}
	}
	// Now check if the shards sent is equal to the minimal shard required
	if len(shard) != pwd_det.min_shard {
		return "", errors.New("Invalid no of Shards")
	}
	// use the shards and decrypt
	secretstring, err := sssa.Combine(shard)
	if err != nil {
		return "", err
	}
	fmt.Println(secretstring)
	return secretstring, nil

}
