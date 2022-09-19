const fs = require('fs');
const google = require('../src/googleModule');
let options = {q:"name contains '.sql.gpg'"}

(async ()=>{
  let auth = google.authorize(__dirname + '/../config/autobackups-1533129260452-637dd11cdc99.json',['https://www.googleapis.com/auth/drive']);
  let fileList = await google.getFileList(auth,options).catch(console.error);
  console.log(fileList);
})();
