const google = require('./src/googleModule');
const sqlmod = require('./src/mysqlModule');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const CREDS = require('./config/creds');
const DBFILE = __dirname + '/config/databases.json';
const BACKPATH = __dirname + "/out/"
var parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];


function parseExistingBackups(fileList){
  let ids = [];
  fileList.forEach((file)=>{
    if(file.name.match(/.sql.gpg/)){
      ids.push(file.id);
    }
  });
  return ids;
}
async function pruneOldBackUps(auth){
  let fileList = await google.getFileList(auth,{}).catch((err)=>{throw err; return});
  let backupIds = parseExistingBackups(fileList);
  for(i in backupIds){
    await google.deleteFile(auth,backupIds[i]).catch((err)=>{throw err; return});
  }
}
function cleanup(){
  exec('rm ' + BACKPATH + "*.gpg",(err,stdout,stderr)=>{
    if(err) throw err
    if(stderr) console.error(stderr);
  });
}
function backupsExist(){
  let files = fs.readdirSync(BACKPATH);
  for(const file in files){
    if(path.extname(BACKPATH + files[file]) == '.gpg'){
      return true;
    }
  }
  return false;
}
/*THE ACTION TAKES PLACE HERE*/

(async ()=>{
  let myuser = CREDS.username;
  let mypass = CREDS.password;
  let databases = JSON.parse(fs.readFileSync(DBFILE));
  sqlmod.setUser(myuser,mypass);
  if(backupsExist()){
    cleanup();
  }
  let auth = google.authorize(__dirname + '/config/autobackups-1533129260452-637dd11cdc99.json',['https://www.googleapis.com/auth/drive']);
  await pruneOldBackUps(auth).catch(console.error);
  databases.forEach(async (database)=>{
    try{
      await sqlmod.backupDB(database);
      console.log('Backed up ' + database + '...');
    }catch(err){
      console.error(err);
      return;
    }
    try{
      await sqlmod.encryptOutput(sqlmod.getOutPath(database),CREDS.encryptionPhrase).catch(console.error);
      console.log('Encrypted ' + database + '...');
    }catch(err){
      console.error(err);
      return;
    }
    try{
      let fileMetaData = {name:path.basename(sqlmod.getEncryptedPath(database)),parents:parentFolders};
      await google.uploadFile(auth,sqlmod.getEncryptedPath(database),fileMetaData).catch(console.error)
      console.log('Uploaded ' + path.basename(sqlmod.getEncryptedPath(database)) + ' to GoogleDrive.');
    }catch(err){
      console.error(err);
      return;
    }
  });
})();
