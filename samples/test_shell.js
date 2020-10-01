const sqlmod = require('../src/mysqlModule');


(async ()=>{
  try{
    let out = await sqlmod.testShellAccess();
    console.log(out);
  }catch(err){
    console.error(err);
  }
})();
