 import {dto} from './dto'
import mysql, { Connection,RowDataPacket  } from 'mysql2/promise';

export async function  Storepwd(secretrec: dto.SecretRecord,con: dto.Connection) {
const query = 'INSERT INTO secrets(userid,appid,keyvalue,secretvalue) VALUES (?, ?,?,?)';
const values = [secretrec.userid,secretrec.appid,secretrec.keyvalue,secretrec.secretvalue];
const connection = await mysql.createConnection(con);

  try {
    
          await connection.execute(query, values);
          console.log('Rows inserted successfully.');
    } catch (error) {
    console.error('Error inserting rows:', error);
  } finally {
    await connection.end(); // Close the MySQL connection
  }
}

export async function  Getpwd(secretrec: dto.SecretRecord,con:dto.Connection):Promise<dto.SecretRecord> {
    const querys = "select secretvalue from secrets where userid='"+secretrec.userid+"' and appid='"+secretrec.appid+"' and keyvalue='"+secretrec.keyvalue+"'";
    //const values = [secretrec.userid,secretrec.appid,secretrec.keyvalue];
    const connection = await mysql.createConnection(con);
    try 
    {
        console.log(querys) 
    const [rows]:[RowDataPacket[],any]= await connection.query(querys);
 
    console.log(rows[0].secretvalue)
   secretrec.secretvalue=rows[0].secretvalue
  } catch (error) {
    console.error('Error retrieving records:', error);
  } finally {
    await connection.end(); // Close the MySQL connection
  }
  return new Promise((resolve,reject)=> {
    resolve(secretrec)
 })
}

 





    






