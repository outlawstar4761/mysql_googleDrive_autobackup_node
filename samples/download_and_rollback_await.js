const sqlmod = require('../src/mysqlModule');
const google = require('../src/googleModule');
const fs = require('fs');

const mysqluser = 'root';
const mysqlpass = 'sample';
const targetDb = 'sample';
const passphrase = 'sample';

async function _getDownloadId(googleAuth,targetDb){
  try{
    let targetFile = targetDb + '.sql.gpg';
    let fileList = await google.getFileList(googleAuth,{q:"name = '" + targetFile + "'"});
    return fileList.length ? fileList[0].id:null;
  }catch(err){
    console.error(err);
    return null;
  }
}

(async ()=>{
  sqlmod.setUser(mysqluser,mysqlpass);
  let auth = google.authorize(__dirname + '/../config/autobackups-1533129260452-637dd11cdc99.json',['https://www.googleapis.com/auth/drive']);
  let targetId = await _getDownloadId(auth,targetDb);
  if(targetId !== null){
    await google.downloadFile(auth,targetId,sqlmod.getEncryptedPath(targetDb)).catch(console.error);
    await sqlmod.decryptOutput(sqlmod.getEncryptedPath(targetDb),passphrase).catch(console.error);
    await sqlmod.restoreDB(targetDb,sqlmod.getOutPath(targetDb)).catch(console.error);
  }else{
    console.log('Unable to find a backup for ' + targetDb);
  }
})();
