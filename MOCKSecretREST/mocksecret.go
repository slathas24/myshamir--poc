package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	_ "github.com/lib/pq"
)

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbpwd  = "postgres"
	dbname = "postgres"
)

type Secretrecord struct {
	User_id  int    `json:"userid"`
	Shard_no int    `json:"shardno"`
	Shard    string `json:"shard"`
}

var db *sql.DB

func opendb() (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, dbpwd, dbname)
	//fmt.Println(connStr)
	db, err1 := sql.Open("postgres", connStr)
	if err1 != nil {
		return nil, err1
	}
	fmt.Println("opend")

	return db, nil
}
func postshardfunc(w http.ResponseWriter, req *http.Request) {
	db, er := opendb()
	if er != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Some error encountered"))
	}
	var rec Secretrecord
	err := json.NewDecoder(req.Body).Decode(&rec)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Some error encountered in secret writing "))
	}
	fmt.Println(rec)
	sqlStatement := `INSERT INTO az_secret_table (user_id,shardno,shard) VALUES ($1, $2,$3)`
	_, err = db.Exec(sqlStatement, rec.User_id, rec.Shard_no, rec.Shard)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Some error encountered in secret writing "))
	}

	w.WriteHeader(http.StatusOK)
	defer db.Close()
}

func getshardfunc(w http.ResponseWriter, req *http.Request) {
	id := strings.TrimPrefix(req.URL.Path, "/secret/get/")

	db, er := opendb()
	if er != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Some error encountered"))
	}
	row := db.QueryRow("select * from az_secret_table where user_id=$1", id)
	var rec Secretrecord

	if err := row.Scan(&rec.User_id, &rec.Shard_no, &rec.Shard); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Some error encountered"))
	}
	recBytes, _ := json.MarshalIndent(rec, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(recBytes)
	defer db.Close()
}

func handleRequests() {
	http.HandleFunc("/secret/get/", getshardfunc)
	http.HandleFunc("/secret/post", postshardfunc)
	log.Fatal(http.ListenAndServe(":9091", nil))
}

func main() {
	handleRequests()
}
