const sqlmod = require('../src/mysqlModule');

mysqluser = 'root';
mysqlpass = 'sample'
targetDb = 'sample';

(async ()=>{
  sqlmod.setUser(mysqluser,mysqlpass);
  try{
    await sqlmod.restoreDB(targetDb,sqlmod.getOutPath(targetDb));
  }catch(err){
    console.error(err);
  }
})();
