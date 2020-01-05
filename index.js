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

fs.readFile(google.CRED_PATH,(err,content)=>{
    if (err) return console.log('Error loading client secret file:',err);
    getDatabases().then((databases)=>{
        databases.forEach((database)=>{
            execBackUpScript(database,PASSPHRASE).then((outputFile)=>{
                var fileInfo = pathinfo(outputFile);
                var parentFolders = ['1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ','13YNO4-gpZk8MW-rIZbCqFa2zLohzbD-s','1oDOv1m3Crv7CVuPbC3RKOboztLY91F1o'];
                var fileMetaData = {name:fileInfo.filename,parents:parentFolders};
                google.authorize(JSON.parse(content),(auth)=>{google.uploadFile(auth,outputFile).catch(console.error)});
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
