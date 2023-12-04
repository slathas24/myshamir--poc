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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Getpwd = exports.Storepwd = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
function Storepwd(secretrec, con) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO secrets(userid,appid,keyvalue,secretvalue) VALUES (?, ?,?,?)';
        const values = [secretrec.userid, secretrec.appid, secretrec.keyvalue, secretrec.secretvalue];
        const connection = yield promise_1.default.createConnection(con);
        try {
            yield connection.execute(query, values);
            console.log('Rows inserted successfully.');
        }
        catch (error) {
            console.error('Error inserting rows:', error);
        }
        finally {
            yield connection.end(); // Close the MySQL connection
        }
    });
}
exports.Storepwd = Storepwd;
function Getpwd(secretrec, con) {
    return __awaiter(this, void 0, void 0, function* () {
        const querys = "select secretvalue from secrets where userid='" + secretrec.userid + "' and appid='" + secretrec.appid + "' and keyvalue='" + secretrec.keyvalue + "'";
        //const values = [secretrec.userid,secretrec.appid,secretrec.keyvalue];
        const connection = yield promise_1.default.createConnection(con);
        try {
            console.log(querys);
            const [rows] = yield connection.query(querys);
            console.log(rows[0].secretvalue);
            secretrec.secretvalue = rows[0].secretvalue;
        }
        catch (error) {
            console.error('Error retrieving records:', error);
        }
        finally {
            yield connection.end(); // Close the MySQL connection
        }
        return new Promise((resolve, reject) => {
            resolve(secretrec);
        });
    });
}
exports.Getpwd = Getpwd;
