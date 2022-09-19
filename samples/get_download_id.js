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
  let auth = google.authorize(__dirname + '/../config/autobackups-1533129260452-637dd11cdc99.json',['https://www.googleapis.com/auth/drive']);
  let targetId = await _getDriveId(auth,targetDb);
  console.log(targetId);
})();
