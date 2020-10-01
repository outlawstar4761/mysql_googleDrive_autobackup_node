const sqlmod = require('../src/mysqlModule');
const google = require('../src/googleModule');
const fs = require('fs');

const mysqluser = 'root';
const mysqlpass = 'sample';
const targetDb = 'sample';
const passphrase = 'sample';

async function _doDownload(googleAuth,targetDb){
  let dest = sqlmod.getEncryptedPath(targetDb);
  try{
    await google.downloadFile();
  }catch(err){
    console.error(err);
  }
}
async function _getDownloadId(googleAuth,targetDb){
  try{
    let targetFile = targetDb + '.sql.gpg';
    let fileList = await google.getFileList(auth,{q:"name = '" + targetFile + "'"});
  }catch(err){
    console.error(err);
    return null;
  }
  return fileList[0].id
  return null;
}

(async ()=>{
  const secret = google.getSecret();
  sqlmod.setUser(mysqluser,mysqlpass);
  google.authorize(secret,async (auth)=>{
    let targetId = _getDownloadId(auth,targetDb);
    console.log(targetId);
    // try{
    //   await google.downloadFile(auth,targetId,sqlmod.getEncryptedPath(targetDb));
    // }catch(err){
    //   console.error(err);
    // }
  });
})();
