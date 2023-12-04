import {SecretRecord } from '../dto'
import { VAULT_TOKEN,VAULT_URL,SECRET_PATH } from './Constants'
//import vault   from 'node-vault';
const vaultClient = require('node-vault')({ apiVersion: 'v1', endpoint: VAULT_URL, token: VAULT_TOKEN });
//const vaultClient =vault({ apiVersion: 'v1', endpoint: VAULT_URL, token: VAULT_TOKEN });

export async function  Storepwd(secretrec: SecretRecord) {
// Path where you want to store and retrieve secrets
const secretPath =  SECRET_PATH+secretrec.userid+"/"+secretrec.appid;
console.log(secretPath)
//const data = '"'+secretrec.keyvalue+'": "'+secretrec.secretvalue+'"'
const str1 = `${secretrec.keyvalue}`
const str2 = `${secretrec.secretvalue}`
const data = {
    [str1]:str2
  };

  console.log({ data });
try {
    await vaultClient.write(secretPath,{ data });
   console.log('Secret stored successfully.');
  } catch (error) {
    console.error('Error storing secret:', error);
  }
}

export async function  Getpwd(secretrec: SecretRecord):Promise<SecretRecord> {
  
  const secretPath =  SECRET_PATH+secretrec.userid+"/"+secretrec.appid;
    var ob=new SecretRecord(secretrec.userid,secretrec.appid,secretrec.keyvalue,'')
    try {
       const response = await  vaultClient.read(secretPath);
        const secretData  = response.data.data;
       if (secretData) {
         ob.secretvalue=secretData[secretrec.keyvalue]
         console.log('the ob is',ob)
        
      //const v = secretData[secretrec.keyvalue]; //.value
      //console.log('Retrieved secret data:', secretData[secretrec.keyvalue]);
      
    
    } else {
      console.log('Secret not found.');
    }
  } catch (error) {
    console.error("We are geeting Error retrieving secret:", error);
  }
  return new Promise((resolve,reject)=> {
    resolve(ob)
  })
}
 

// Uncomment the function calls to execute them
// storeSecret();
// retrieveSecret();
