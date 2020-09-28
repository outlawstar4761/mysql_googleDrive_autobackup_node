const google = require('./googleModule');
const {exec} = require('child_process');
const DBFILE = __dirname + '/databases.json';
const PASSPHRASE = '1234';
var parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];


function execBackUpScript(database,passphrase){
  return new Promise((resolve,reject)=>{
    var outputFile = __dirname + "/" + database + '.sql.gpg';
    var cmd = __dirname + '/mysqlbackup.sh ' + database + ' ' + passphrase;
    exec(cmd,(err,stdout,stderr)=>{
      if(err) reject(err);
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

let secret = JSON.parse(fs.readFileSync(google.CRED_PATH));
let databases = JSON.parse(fs.readFileSync(DBFILE));
google.authorize(secret,(auth)=>{
  pruneOldBackUps(auth);
  databases.forEach((database)=>{
    execBackUpScript(database,PASSPHRASE).then((outputFile)=>{
      var fileMetaData = {name:outputFile,parents:parentFolders};
      google.uploadFile(auth,outputFile,fileMetaData).catch(console.error)
    }).catch(console.error);
  });
});
