const fs = require('fs');
const google = require('../src/googleModule');
let secret = google.getSecret();
let targetFolder = '1BWiXZKWmbidk2RbQVecL8du6Ma2RigtZ';

(async ()=>{
  google.authorize(secret,async (auth)=>{
    let fileList = await google.getFileList(auth,{q:"name contains '.sql.gpg'"}).catch(console.error);
    console.log(fileList);
  });
})();
