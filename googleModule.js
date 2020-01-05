var googleModule = (function(){
    const fs = require('fs');
    const readline = require('readline');
    const {google} = require('googleapis');
    const mime = require('mime-types');
    const SCOPES = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive',
    ];
    const TOKEN_PATH = 'token.json';
    const CRED_PATH = 'credentials.json';

    function authorize(credentials,callback){
        const {client_secret,client_id,redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
        fs.readFile(TOKEN_PATH,(err,token)=>{
            if(err) return getAccessToken(oAuth2Client,callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    function getAccessToken(oAuth2Client,callback){
        const authUrl = oAuth2Client.generateAuthUrl({access_type:'offline',scope:SCOPES});
        console.log('Authorize this app by visiting this url: ',authUrl);
        const rl = readline.createInterface({input:process.stdin,output:process.stdout});
        rl.question('Enter the code from that page here: ',(code)=>{
            rl.close();
            oAuth2Client.getToken(code,(err,token)=>{
                if(err) return callback(err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH,JSON.stringify(token),(err)=>{
                    if(err) console.error(err);
                    console.log('Token stored to',TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }
    return {
        CRED_PATH:CRED_PATH,
        authorize:function(credentials,callback){
            authorize(credentials,callback);
        },
        getFileList:function(auth){
            return new Promise((resolve,reject)=>{
                var fileList = [];
                const drive = google.drive({version:'v3',auth});
                // {pageSize:10,fields:'nextPageToken,files(id,name)'}
                drive.files.list({},(err,res)=>{
                    if(err) reject(err);
                    const files = res.data.files;
                    files.forEach((file)=>{fileList.push(file);});
                    resolve(fileList);
                });
            });
        },
        uploadFile:async function(auth,filePath,fileMetaData){
            const drive = google.drive({version:'v3',auth});
            var media = {mimeType:mime.lookup(fileInfo.extname),body:fs.createReadStream(filePath)}
            const res = await drive.files.create({resource:fileMetaData,media:media});
        }
    }
}());

module.exports = googleModule;
