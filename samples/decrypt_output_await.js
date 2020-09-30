const sqlmod = require('../src/mysqlModule');
const mysqluser = 'root';
const mysqlpass = 'sample';
const targetDb = 'sample';
const passphrase = 'sample';

(async ()=>{
  sqlmod.setUser(mysqluser,mysqlpass);
  try{
    await sqlmod.decryptOutput(sqlmod.getEncryptedPath(targetDb),passphrase);
  }catch(err){
    console.error(err);
  }
})();
