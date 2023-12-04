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
const dto_1 = require("./dto/dto");
//import { Storepwd,  Getpwd } from './dto/PGDAL'
//import { Storepwd,Getpwd } from './dto/MYSQL'
const secretengine_1 = require("./secretengine/secretengine");
//import { Storepwd,Getpwd } from './dto/hashicorp/Vaultaccess';
// program begining 
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //let x= new SecretRecord("P009",'APP1','PASSWD','Dont_Please_123$')
        //await seng.SaveSecret(x)
        //  GenerateShares(x.secretvalue)
        //  .then(() => {
        //    console.log("done",x.secretvalue);
        // }
        //.catch((error) => {
        //   console.error('Error:', error);
        //});
        let y = new dto_1.SecretRecord("1603914", 'TRIALAPP', 'APPPASSWD', 'Hey+Comeon_u_cando12$');
        yield secretengine_1.seng.SaveSecret(y)
            .then((res) => {
            console.log(res);
            console.log('The end');
        });
        //y.secretvalue)
    });
}
main();
/*
let x= new SecretRecord("A021",'new','DBPWD','This_is_grt12$') //{actorId:10,firstName:'Lata'}
console.log(x)
 Storepwd(x)
 .then(() => {
    console.log('Retrieved rows:');
    console.log(x);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
console.log("ddd",x)

let y= new SecretRecord("A001",'new','DBPWD','')
Getpwd(y)
      .then(() => {
        console.log(y);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    */
//  to test mysql 
/*
let x= new SecretRecord("A021",'playbook','DBPWD','This_is_grt12$') //{actorId:10,firstName:'Lata'}
//console.log(x)
Storepwd(x)
.then(() => {
console.log('Retrieved rows:');
console.log(x);
})
.catch((error) => {
console.error('Error:', error);
});
console.log("ddd",x)

let y= new SecretRecord("A021",'playbook','DBPWD','')
Getpwd(y)
  .then(() => {
    console.log(y);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
  
  //  for Hashicorp

  let x= new SecretRecord("A021",'new','DBPWD','This_is_grt12$') //{actorId:10,firstName:'Lata'}
  console.log(x)
   Storepwd(x)
   .then(() => {
      console.log('Retrieved rows:');
      console.log(x);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  //console.log("ddd",x)

  let y= new SecretRecord("A021",'MyApp','APIKEY','')
  Getpwd(y)
  .then(() => {
    console.log(y);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  */ 
