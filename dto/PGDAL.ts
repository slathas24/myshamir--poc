import { Client } from 'pg';
import {SecretRecord, dto} from './dto'
//import { Connection } from 'mysql2/typings/mysql/lib/Connection';


export async function  Storepwd(secretrec: dto.SecretRecord, con: dto.Connection  ) {
    const client = new Client(con);
    const query = {
       text: 'insert into secrets(userid,appid,keyvalue,secretvalue) values ($1,$2,$3,$4)',
       values : [secretrec.userid,secretrec.appid,secretrec.keyvalue,secretrec.secretvalue]
    };
    console.log("going to add")
    try {
          await client.connect();
          await client.query(query);
          //secretrec.appid = "newww"
          console.log("AAA added");
          
           
    }
    catch(error) {
           console.error('Error inserting rows:', error);
          } finally {
            await client.end(); // Close the database connection
            
          }
       
 }
    
 
 export async function  Getpwd(secretrec: dto.SecretRecord,con:dto.Connection):Promise<dto.SecretRecord> {
    
    const client = new Client(con);
    const query = 'SELECT secretvalue FROM secrets where userid=$1 and appid=$2 and keyvalue=$3'
    const values = [secretrec.userid,secretrec.appid,secretrec.keyvalue]  
    try {
        await client.connect(); // Connect to the PostgreSQL database
    
        // Define the SQL query to retrieve rows from a table
       
    
        // Execute the query and retrieve the result set
        const result = await client.query(query, values);
        console.log("Result is",result.rowCount)
        // Extract rows from the result and return as an array of objects
        secretrec.secretvalue = result.rows[0].secretvalue;         
      } catch (error) {
        console.error('Error querying PostgreSQL:', error);
      } finally {
        await client.end(); // Close the database connection
      }
      return new Promise((resolve,reject)=> {
         resolve(secretrec)
      })
    }

    
    
    // Example usage
    
    




