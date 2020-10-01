const fs = require('fs');
const google = require('../src/googleModule');
let secret = google.getSecret();
let options = {q:"name contains '.sql.gpg'"}

(async ()=>{
  google.authorize(secret,async (auth)=>{
    let fileList = await google.getFileList(auth,options).catch(console.error);
    console.log(fileList);
  });
})();
