const fs = require('fs');
const google = require('../src/googleModule');
let secret = google.getSecret();

(async ()=>{
  google.authorize(secret,(auth)=>{
    let fileList = await google.getFileList();
    console.log(fileList);
  });
})();
