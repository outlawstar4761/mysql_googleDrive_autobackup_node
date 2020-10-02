const google = require('../src/googleModule');

let targetDb = 'sample';

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

(async ()=>{
  google.authorize(secret,async (auth)=>{
    let targetId = await _getDriveId(auth,targetDb);
    console.log(targetId);
  });
})();
