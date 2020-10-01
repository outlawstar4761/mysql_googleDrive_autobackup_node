const fs = require('fs');
const google = require('../src/googleModule');
const fileId = '1miOlOQ7X252pkFNg5NB1PF9uCPrYxq_J';
let secret = JSON.parse(fs.readFileSync(google.CRED_PATH));
let dest = '../out/download.sql.gpg';

(async ()=>{
  google.authorize(secret,(auth)=>{
    console.log(await google.getFileList());
  });
})();
