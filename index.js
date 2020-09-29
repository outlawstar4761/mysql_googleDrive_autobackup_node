const google = require('./googleModule');
const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const DBFILE = __dirname + '/databases.json';
const BACKPATH = __dirname + "/"
const PASSPHRASE = '1234';
var parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];


function execBackUpScript(database,passphrase){
  return new Promise((resolve,reject)=>{
    var outputFile = __dirname + "/" + database + '.sql.gpg';
    var cmd = __dirname + '/mysqlbackup.sh ' + database + ' ' + passphrase;
    exec(cmd,(err,stdout,stderr)=>{
      if(err) reject(err);
      if(stderr) console.error(stderr);
      resolve(outputFile);
    });
  });
}
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
    backupIds.forEach((id)=>{
      google.deleteFile(auth,id);
    });
  },console.error);
}
function cleanup(){
  exec('rm ' + __dirname + "/*.gpg",(err,stdout,stderr)=>{
    if(err) throw err
    if(stderr) console.error(stderr);
  });
}
function backupsExist(){
  let fileCount = fs.readdirSync(BACKPATH);
  fileCount.forEach((file)=>{
    if(path.extname(BACKPATH + file) == '.gpg'){
      return true;
    }
  });
}
//path.extname()
/*THE ACTION TAKES PLACE HERE*/
if(backupsExist()){
  cleanup()
}
let secret = JSON.parse(fs.readFileSync(google.CRED_PATH));
let databases = JSON.parse(fs.readFileSync(DBFILE));
google.authorize(secret,(auth)=>{
  pruneOldBackUps(auth);
  databases.forEach((database)=>{
    execBackUpScript(database,PASSPHRASE).then((outputFile)=>{
      var fileMetaData = {name:path.basename(outputFile),parents:parentFolders};
      google.uploadFile(auth,outputFile,fileMetaData).catch(console.error)
    }).catch(console.error);
  });
});
