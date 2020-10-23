const google = require('./src/googleModule');
const sqlmod = require('./src/mysqlModule');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const DBFILE = __dirname + '/config/databases.json';
const BACKPATH = __dirname + "/out/"
const PASSPHRASE = 'sample';
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
function pruneOldBackUps(auth){
  google.getFileList(auth,{}).then((fileList)=>{
    let backupIds = parseExistingBackups(fileList);
    backupIds.forEach(async (id)=>{
      await google.deleteFile(auth,id);
    });
  },console.error);
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
  let myuser = 'root';
  let mypass = 'sample';
  let secret = google.getSecret();
  let databases = JSON.parse(fs.readFileSync(DBFILE));
  sqlmod.setUser(myuser,mypass);
  if(backupsExist()){
    cleanup();
  }
  google.authorize(secret,async (auth)=>{
    pruneOldBackUps(auth);
    databases.forEach(async (database)=>{
      await sqlmod.backupDB(database);
      console.log('Backed up ' + database + '...');
      await sqlmod.encryptOutput(sqlmod.getOutPath(database),PASSPHRASE);
      console.log('Encrypted ' + database + '...');
      let fileMetaData = {name:path.basename(sqlmod.getEncryptedPath(database)),parents:parentFolders};
      await google.uploadFile(auth,sqlmod.getEncryptedPath(database),fileMetaData).catch(console.error)
      console.log('Uploaded ' + path.basename(sqlmod.getEncryptedPath(database)) + ' to GoogleDrive.');
    });
  });
})();
