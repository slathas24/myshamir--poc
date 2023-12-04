import { SecretRecord } from './dto/dto';
//import { Storepwd,  Getpwd } from './dto/PGDAL'
//import { Storepwd,Getpwd } from './dto/MYSQL'
import { seng } from './secretengine/secretengine'
//import { Storepwd,Getpwd } from './dto/hashicorp/Vaultaccess';

// program begining 
async function main() {
//let x= new SecretRecord("P009",'APP1','PASSWD','Dont_Please_123$')
//await seng.SaveSecret(x)
    //  GenerateShares(x.secretvalue)
    //  .then(() => {
    //    console.log("done",x.secretvalue);
     // }
      //.catch((error) => {
     //   console.error('Error:', error);
      //});
     
      
    
      let y= new SecretRecord("1603914",'TRIALAPP','APPPASSWD','Hey+Comeon_u_cando12$')
       await seng.SaveSecret(y)
      .then((res) => {
        console.log(res)
        console.log('The end') 
      })
      //y.secretvalue)
      
    }

    main()
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