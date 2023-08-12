package main

import (
	"fmt"
	//sssa "github.com/jwayong/sssa-golang"
	"log"
	"util"
)

func main() {
	/*
		secret := "AllisWell12*"
		user_id := 1603915
		err := util.GenerateShard(user_id, secret)
		if err != nil {
			log.Fatal("Eooror ", err)
		}
	*/
	var shards [3]string
	shards[0] = "Kx1_pvo96VrQC_1ULKH6izzPo0r4sSA4zd47KIbUmYk=wxRyzcFIvEQDwxllrXWV-qtWtQDD_Zs2owucy4oRk0g="
	shards[1] = "HFqHjLAg8nlrbSahxRwfLs-r-TuaNg545aWZiGvLbvE=fDjRBmj1sGXKtQ9F29ZcZzT1IUhhzMhxD0itVTIOebM="
	//shards[1] = "dLdtIr5FyRPfORW4jjJrFixFAeg3YF0JRI_0ETYDPfM=ohxBn_IFs9JjbqOKjdniDOVmqWgCgbfQV71rszHn-44="
	shards[2] = "p7p3_JD7jmnuUxuYKAhO50ysTsMBOI7nCk3YX4jmJoY=2Snxzr8oDCU_OZh239rcS5hF0sNYiCCIKBV7i_UeYQE="
	myshards := shards[:]
	str, err := util.DecryptShard(1603914, myshards)
	if err != nil {
		log.Fatal("Eooror ", err)
	}
	fmt.Println(str)
	/*
		sharesssa, _ := sssa.Create(3, 5, ")
		fmt.Println("Encrypting text: januarwayong into 5 parts, minimum 3 parts to recover")
		fmt.Println("----------------------------------------------------------------------")
		for _, s := range sharesssa {
			fmt.Println(s)
		}

		//secretstring,_ := sssa.Combine(sharesssa[1:4])
		fmt.Println("Decrypting text: using minimum 3 parts")
		fmt.Println("----------------------------------------------------------------------")
		secretstring, _ := sssa.Combine([]string{sharesssa[0], sharesssa[2], sharesssa[3]})

		fmt.Println("Decrypted text: ")
		fmt.Println(secretstring)
	*/
}
