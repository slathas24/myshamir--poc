
//defining the Connection details 
export type Connection = {
        user: string,
        password: string,
        host: string,
        port: number, // PostgreSQL default port
        database: string
};
const p1=Number(process.env.PG1_PORT) 
const p2=Number(process.env.PG2_PORT) 
const p3=Number(process.env.MS1_PORT)
export const pgconn1: Connection= { user: "postgres", password: "postgres", host:  process.env.PG1_HOST ||'localhost',port: p1|| 5435, database: "postgres"}  // PostgreSQL default port}
export const pgconn2: Connection= { user: "postgres", password: "postgres", host:  process.env.PG2_HOST ||'localhost',port: p2||5433, database: "postgres"}  // PostgreSQL default port}
export const mysqlcon: Connection = {
  host: process.env.MS1_HOST || '127.0.0.1',  //'DESKTOP-AI9J04E',
  user: 'mysql',
  password: 'mysql',
  database: 'mysql',
  port: p3 || 3306
}
export class SecretRecord {
       public userid: string
      public  appid:string
      public  keyvalue:string
      public  secretvalue:string
      public  constructor(uid:string,apid:string,kv:string,sv:string) {
        this.userid = uid
        this.appid=apid
        this.keyvalue=kv
        this.secretvalue=sv
      }

}
console.log(pgconn1)
console.log (pgconn2)
console.log(mysqlcon)

export * as dto from './dto'
