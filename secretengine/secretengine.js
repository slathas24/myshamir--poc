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
exports.seng = exports.RetrieveSecret = exports.SaveSecret = void 0;
const shamir_secret_sharing_1 = require("shamir-secret-sharing");
const dto_1 = require("../dto/dto");
//import { Storepwd } from '../dto/MYSQL';
const totalshares = 4;
const minshares = 2;
const ds_array = ['mysql', 'pg2', "pg1", "hcorp"];
//const ds_array = ["pg1","pg2"] // hcorp"]
var shardarray = Array(totalshares);
function SaveSecret(secretrec) {
    return __awaiter(this, void 0, void 0, function* () {
        // This will generate the array of spllit(s)
        yield GenerateShares(secretrec.secretvalue);
        //logic to store each shard into datastore as of now hardcoded but need to be more generic 
        let tmp = secretrec;
        var i = 0;
        for (const ds of ds_array) {
            console.log(ds);
            if (ds.match("pg1")) {
                tmp.secretvalue = shardarray[i];
                console.log(i);
                yield Promise.resolve().then(() => __importStar(require("../dto/PGDAL"))).then((m) => {
                    m.Storepwd(tmp, dto_1.dto.pgconn1)
                        .then(() => {
                        console.log('pg1', tmp);
                    });
                });
            }
            else if (ds.match("pg2")) {
                console.log(i);
                tmp.secretvalue = shardarray[i];
                yield Promise.resolve().then(() => __importStar(require("../dto/PGDAL"))).then((m) => {
                    m.Storepwd(tmp, dto_1.dto.pgconn2)
                        .then(() => {
                        console.log('pg2', tmp);
                    });
                });
            }
            else if (ds.match("mysql")) {
                tmp.secretvalue = shardarray[i];
                yield Promise.resolve().then(() => __importStar(require("../dto/MYSQL"))).then(m => m.Storepwd(tmp, dto_1.dto.mysqlcon));
                console.log("added mysql");
            }
            else if (ds.match("hcorp")) {
                tmp.secretvalue = shardarray[i];
                yield Promise.resolve().then(() => __importStar(require("../dto/hashicorp/Vaultaccess"))).then(m => m.Storepwd(tmp));
                console.log("added hcorp");
            }
            i = i + 1;
        }
    });
}
exports.SaveSecret = SaveSecret;
function GenerateShares(secretValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        console.log(secretValue);
        const uint8Array = encoder.encode(secretValue);
        // console.log("Array is",uint8Array)
        const shares = yield (0, shamir_secret_sharing_1.split)(uint8Array, totalshares, minshares);
        console.log("Total shares generated", shares.length);
        // Logic to convert unint array shares into  string 
        shardarray.fill('');
        var i = 0;
        for (var sh of shares) {
            shardarray[i] = convertUint8ArrayToHexString(sh);
            i++;
        }
        console.log(shardarray);
    });
}
function RetrieveSecret(secretrec) {
    return __awaiter(this, void 0, void 0, function* () {
        var gotshards = Array(minshares);
        gotshards.fill('');
        var dsarr = Array(minshares);
        dsarr.fill(0);
        // getting any two random resources 
        dsarr = GetRandomresources(minshares, totalshares);
        //const dsarr=[3,2]
        console.log(dsarr, ds_array);
        // logic for retrieving the data stored in each ds 
        var tmp = secretrec;
        const ds = '';
        var n = 0;
        for (const d of dsarr) {
            const ds = ds_array[dsarr[d]];
            console.log(d, ds, n, ds_array[d]);
            if (ds_array[d].match("pg1")) {
                yield Promise.resolve().then(() => __importStar(require("../dto/PGDAL"))).then((m) => __awaiter(this, void 0, void 0, function* () {
                    const p = yield m.Getpwd(tmp, dto_1.dto.pgconn1)
                        .then((res) => {
                        gotshards[n] = res.secretvalue;
                        console.log('pg1', n, gotshards[n]);
                    });
                }));
            }
            else if (ds_array[d].match("pg2")) {
                console.log("pg2");
                yield Promise.resolve().then(() => __importStar(require("../dto/PGDAL"))).then((m) => __awaiter(this, void 0, void 0, function* () {
                    yield m.Getpwd(tmp, dto_1.dto.pgconn2)
                        .then((res) => {
                        gotshards[n] = res.secretvalue;
                        console.log('pg1', n, gotshards[n]);
                    });
                }));
            }
            else if (ds_array[d].match("mysql")) {
                console.log("mysql");
                yield Promise.resolve().then(() => __importStar(require("../dto/MYSQL"))).then((m) => __awaiter(this, void 0, void 0, function* () {
                    yield m.Getpwd(tmp, dto_1.dto.mysqlcon)
                        .then((res) => {
                        gotshards[n] = res.secretvalue;
                        console.log('mysql', n, gotshards[n]);
                    });
                }));
            }
            else if (ds_array[d].match("hcorp")) {
                console.log("hcorp");
                yield Promise.resolve().then(() => __importStar(require("../dto/hashicorp/Vaultaccess"))).then((m) => __awaiter(this, void 0, void 0, function* () {
                    yield m.Getpwd(tmp)
                        .then((res) => {
                        gotshards[n] = res.secretvalue;
                        console.log('hc', n, gotshards[n]);
                    });
                }));
            }
            console.log('complete', gotshards);
            n = n + 1;
            //ds=''
        }
        //shardaarr[n]=tmp.secretvalue       
        var uarr1 = Array(minshares);
        var n = 0;
        for (const element of gotshards) {
            uarr1[n] = convertHexStringToUint8Array(element);
            n = n + 1;
        }
        //const uarr = gotshards.map((s) => convertHexStringToUint8Array(s));  
        // console.log('The size of the uint array is',uarr.length,uarr)
        // To combine the shares
        //const x = [convertHexStringToUint8Array(shardarray[2]),convertHexStringToUint8Array(shardarray[1])]
        //const y = Buffer.from(shares[2]).toString('hex')
        //console.log("Shared value",y,shares[2])
        //const x = [shares[2],shares[1]]
        const restore = yield (0, shamir_secret_sharing_1.combine)(uarr1);
        const decoder = new TextDecoder();
        console.log("'hereh I a,m ", decoder.decode(restore));
        secretrec.secretvalue = decoder.decode(restore);
        return new Promise((resolve, reject) => {
            resolve(secretrec);
        });
        ///secretrec.secretvalue=decoder.decode(restore)
        //}
    });
}
exports.RetrieveSecret = RetrieveSecret;
function convertUint8ArrayToHexString(uint8Array) {
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        hexString += uint8Array[i].toString(16).padStart(2, '0');
    }
    return hexString;
}
function convertHexStringToUint8Array(hexString) {
    const uint8Array = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }
    return uint8Array;
}
function GetRandomresources(min, max) {
    let numds = Array(min);
    let tmp = 0;
    var dup = false;
    for (var n = 0; n < min; n++) {
        tmp = Math.floor(Math.random() * (((max - 1) - (min)) + 1)) + min;
        dup = false;
        for (var i = 0; i < n; i++) {
            if (numds[i] == tmp) {
                dup = true;
                break;
            }
        }
        //console.log(n,tmp,dup)
        if (dup == true) {
            n = n - 1;
            console.log(n);
        }
        else {
            numds[n] = tmp;
        }
    }
    //console.log(numds)
    return (numds);
}
function loadmodule(m, o) {
    m.Getpwd(o);
    console.log('O is', o);
}
exports.seng = __importStar(require("./secretengine"));
