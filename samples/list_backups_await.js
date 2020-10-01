const fs = require('fs');
const google = require('../src/googleModule');
let secret = google.getSecret();

(async ()=>{
  google.authorize(secret,async (auth)=>{
    let fileList = await google.getFileList(auth,{});
    console.log(fileList);
  });
})();
