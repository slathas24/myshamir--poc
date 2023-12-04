"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dto = exports.SecretRecord = exports.mysqlcon = exports.pgconn2 = exports.pgconn1 = void 0;
const p1 = Number(process.env.PG1_PORT);
const p2 = Number(process.env.PG2_PORT);
const p3 = Number(process.env.MS1_PORT);
exports.pgconn1 = { user: "postgres", password: "postgres", host: process.env.PG1_HOST || 'localhost', port: p1 || 5435, database: "postgres" }; // PostgreSQL default port}
exports.pgconn2 = { user: "postgres", password: "postgres", host: process.env.PG2_HOST || 'localhost', port: p2 || 5433, database: "postgres" }; // PostgreSQL default port}
exports.mysqlcon = {
    host: process.env.MS1_HOST || '127.0.0.1',
    user: 'mysql',
    password: 'mysql',
    database: 'mysql',
    port: p3 || 3306
};
class SecretRecord {
    constructor(uid, apid, kv, sv) {
        this.userid = uid;
        this.appid = apid;
        this.keyvalue = kv;
        this.secretvalue = sv;
    }
}
exports.SecretRecord = SecretRecord;
exports.dto = __importStar(require("./dto"));
