const google = require('./src/googleModule');
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
    await google.deleteFile(auth,id);
  }
}

let targetDb = 'sample';
let targetFile = sqlmod.getOutPath(targetDb);
let parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];
let fileMetaData = {name:path.basename(targetFile),parents:parentFolders};

(async ()=>{
  google.authorize(secret,async (auth)=>{
    await _prune(auth,targetDb);
    await google.uploadFile(auth,targetFile,fileMetaData).catch(console.error);
  });
})();
