var googleModule = (function(){
    const fs = require('fs');
    const readline = require('readline');
    const {google} = require('googleapis');
    const mime = require('mime-types');
    const path = require('path');
    const SCOPES = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive',
    ];
    const AUTHVER = 'v3';
    const TOKEN_PATH = __dirname + '/../config/token.json';
    const CRED_PATH = __dirname + '/../config/credentials.json';

    function authorize(keyFile,scopes){
      return new google.auth.GoogleAuth({
        keyFile: keyFile,
        scopes: scopes,
      });
    }
    return {
        CRED_PATH:CRED_PATH,
        authorize:function(keyFile,scopes){
            return authorize(keyFile,scopes);
        },
        getFileList:function(auth,options){
            return new Promise((resolve,reject)=>{
                var fileList = [];
                const drive = google.drive({version:AUTHVER,auth});
                drive.files.list(options,(err,res)=>{
                    if(err){
                      reject(err);
                      return;
                    }
                    const files = res.data.files;
                    files.forEach((file)=>{fileList.push(file);});
                    resolve(fileList);
                });
            });
        },
        deleteFile:async function(auth,fileId){
            const drive = google.drive({version:AUTHVER,auth});
            const res = await drive.files.delete({fileId:fileId}).catch((err)=>{throw err; return});
            return res;
        },
        uploadFile:async function(auth,filePath,fileMetaData){
            const drive = google.drive({version:AUTHVER,auth});
            var ext = path.extname(filePath);
            var media = {mimeType:mime.lookup(ext),body:fs.createReadStream(filePath)}
            const res = await drive.files.create({resource:fileMetaData,media:media});
        },
        downloadFile:function(auth,fileId,outPath){
            return new Promise((resolve,reject)=>{
              let dest = fs.createWriteStream(outPath);
              const drive = google.drive({version:AUTHVER,auth});
              drive.files.get({fileId:fileId,alt:'media'},{responseType:'stream'},(err,res)=>{
                res.data.on('end',()=>{}).on('err',(err)=>{
                  reject(err);
                }).pipe(dest).on('finish',()=>{
                  resolve();
                });
              });
            });
        }
    }
}());

module.exports = googleModule;
