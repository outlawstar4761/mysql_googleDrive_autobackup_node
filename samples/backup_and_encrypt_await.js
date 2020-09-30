const sqlmod = require('../src/mysqlModule');
const targetDb = 'LOE';

(async ()=>{
  sqlmod.setUser('root','sample');
  try{
    sqlmod.backupDB(targetDb);
    sqlmod.encryptOutput(sqlmod.getOutPath(targetDb),'sample');
  }catch(err){
    console.error(err);
  }
})();
