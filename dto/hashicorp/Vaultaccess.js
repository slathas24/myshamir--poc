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
const dto_1 = require("../dto");
const Constants_1 = require("./Constants");
//import vault   from 'node-vault';
const vaultClient = require('node-vault')({ apiVersion: 'v1', endpoint: Constants_1.VAULT_URL, token: Constants_1.VAULT_TOKEN });
//const vaultClient =vault({ apiVersion: 'v1', endpoint: VAULT_URL, token: VAULT_TOKEN });
function Storepwd(secretrec) {
    return __awaiter(this, void 0, void 0, function* () {
        // Path where you want to store and retrieve secrets
        const secretPath = Constants_1.SECRET_PATH + secretrec.userid + "/" + secretrec.appid;
        console.log(secretPath);
        //const data = '"'+secretrec.keyvalue+'": "'+secretrec.secretvalue+'"'
        const str1 = `${secretrec.keyvalue}`;
        const str2 = `${secretrec.secretvalue}`;
        const data = {
            [str1]: str2
        };
        console.log({ data });
        try {
            yield vaultClient.write(secretPath, { data });
            console.log('Secret stored successfully.');
        }
        catch (error) {
            console.error('Error storing secret:', error);
        }
    });
}
exports.Storepwd = Storepwd;
function Getpwd(secretrec) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretPath = Constants_1.SECRET_PATH + secretrec.userid + "/" + secretrec.appid;
        var ob = new dto_1.SecretRecord(secretrec.userid, secretrec.appid, secretrec.keyvalue, '');
        try {
            const response = yield vaultClient.read(secretPath);
            const secretData = response.data.data;
            if (secretData) {
                ob.secretvalue = secretData[secretrec.keyvalue];
                console.log('the ob is', ob);
                //const v = secretData[secretrec.keyvalue]; //.value
                //console.log('Retrieved secret data:', secretData[secretrec.keyvalue]);
            }
            else {
                console.log('Secret not found.');
            }
        }
        catch (error) {
            console.error("We are geeting Error retrieving secret:", error);
        }
        return new Promise((resolve, reject) => {
            resolve(ob);
        });
    });
}
exports.Getpwd = Getpwd;
// Uncomment the function calls to execute them
// storeSecret();
// retrieveSecret();
