"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Getpwd = exports.Storepwd = void 0;
const pg_1 = require("pg");
//import { Connection } from 'mysql2/typings/mysql/lib/Connection';
function Storepwd(secretrec, con) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client(con);
        const query = {
            text: 'insert into secrets(userid,appid,keyvalue,secretvalue) values ($1,$2,$3,$4)',
            values: [secretrec.userid, secretrec.appid, secretrec.keyvalue, secretrec.secretvalue]
        };
        console.log("going to add");
        try {
            yield client.connect();
            yield client.query(query);
            //secretrec.appid = "newww"
            console.log("AAA added");
        }
        catch (error) {
            console.error('Error inserting rows:', error);
        }
        finally {
            yield client.end(); // Close the database connection
        }
    });
}
exports.Storepwd = Storepwd;
function Getpwd(secretrec, con) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client(con);
        const query = 'SELECT secretvalue FROM secrets where userid=$1 and appid=$2 and keyvalue=$3';
        const values = [secretrec.userid, secretrec.appid, secretrec.keyvalue];
        try {
            yield client.connect(); // Connect to the PostgreSQL database
            // Define the SQL query to retrieve rows from a table
            // Execute the query and retrieve the result set
            const result = yield client.query(query, values);
            console.log("Result is", result.rowCount);
            // Extract rows from the result and return as an array of objects
            secretrec.secretvalue = result.rows[0].secretvalue;
        }
        catch (error) {
            console.error('Error querying PostgreSQL:', error);
        }
        finally {
            yield client.end(); // Close the database connection
        }
        return new Promise((resolve, reject) => {
            resolve(secretrec);
        });
    });
}
exports.Getpwd = Getpwd;
// Example usage
