const fs = require('fs');
const google = require('../src/googleModule');
let secret = google.getSecret();

(async ()=>{
  google.authorize(secret,(auth)=>{
    console.log(await google.getFileList());
  });
})();
