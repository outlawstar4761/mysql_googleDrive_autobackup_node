const fs = require('fs');
const google = require('../src/googleModule');
const fileId = '1miOlOQ7X252pkFNg5NB1PF9uCPrYxq_J';
let secret = google.getSecret();
let dest = '../out/download.sql.gpg';

google.authorize(secret,(auth)=>{
  google.downloadFile(auth,fileId,dest).catch(console.error);
});
