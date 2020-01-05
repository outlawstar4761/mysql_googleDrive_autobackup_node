const google = require('./googleModule');
const {exec} = require('child_process');
const DBFILE = 'databases.json';
const PASSPHRASE = '1234';


function execBackUpScript(database,passphrase){
  return new Promise((resolve,reject)=>{
    var outputFile = database + '.sql.gpg';
    var cmd = './mysqlbackup.sh ' + database + ' ' + passphrase;
    exec(cmd,(err,stdout,stderr)=>{
      if(err) reject(err);
      resolve(outputFile);
    });
  });
}

function getDatabases(){
  return new Promise((resolve,reject)=>{
    fs.readFile(DBFILE,(err,content)=>{
      if (err) reject(err);
      resolve(JSON.parse(content));
    });
  });
}
function parseExistingBackups(fileList){
  let ids = [];
  files.forEach((file)=>{
    if(file.name.match(/.sql.gpg/)){
      ids.push(file.id);
    }
  });
  return ids;
}
function pruneOldBackUps(auth){
  google.getFileList(auth).then((fileList)=>{
    let backupIds = parseExistingBackups(fileList);
    backupIds.forEach((id)=>{
      google.deleteFile(auth,id);
    });
  },console.error);
}

// let secret = JSON.parse(fs.readFileSync(google.CRED_PATH));
// google.authorize(secret,(auth)=>{
//   pruneOldBackUps(auth);
// });

fs.readFile(google.CRED_PATH,(err,content)=>{
    if (err) return console.log('Error loading client secret file:',err);
    getDatabases().then((databases)=>{
        databases.forEach((database)=>{
            execBackUpScript(database,PASSPHRASE).then((outputFile)=>{
                var parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ'];
                var fileMetaData = {name:outputFile,parents:parentFolders};
                google.authorize(JSON.parse(content),(auth)=>{google.uploadFile(auth,outputFile,fileMetaData).catch(console.error)});
            },(err)=>{
                return console.log('Error Executing Backup:',err);
            });
        });
    },(err)=>{
        return console.log('Error Reading Databases:',err);
    });
    //google.authorize(JSON.parse(content),(auth)=>{google.getFileList(auth).then(console.log,console.error);});
    //google.authorize(JSON.parse(content),(auth)=>{google.uploadFile(auth,'testFile.png').catch(console.error)});
});
