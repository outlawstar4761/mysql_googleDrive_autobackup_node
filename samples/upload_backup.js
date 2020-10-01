const path = require('path');
const google = require('../src/googleModule');
const sqlmod = require('../src/mysqlModule');

async function _getDriveId(googleAuth,targetDb){
  let targetFile = targetDb + '.sql.gpg';
  try{
    let fileList = await google.getFileList(googleAuth,{q:"name = '" + targetFile + "'"});
    return fileList.length ? fileList[0].id:null;
  }catch(err){
    console.error(err);
    return null;
  }
}
async function _prune(googleAuth,targetDb){
  let fileId = await _getDriveId(googleAuth,targetDb).catch(console.error);
  if(fileId !== null){
    await google.deleteFile(googleAuth,fileId);
  }
}

let targetDb = 'sample';
let targetFile = sqlmod.getEncryptedPath(targetDb);
let parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];
let fileMetaData = {name:path.basename(targetFile),parents:parentFolders};
let secret = google.getSecret();

(async ()=>{
  google.authorize(secret,async (auth)=>{
    await _prune(auth,targetDb);
    await google.uploadFile(auth,targetFile,fileMetaData).catch(console.error);
  });
})();
