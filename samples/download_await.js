const google = require('../src/googleModule');
const fileId = '1miOlOQ7X252pkFNg5NB1PF9uCPrYxq_J';
let dest = __dirname + '/../out/download.sql.gpg';

let auth = google.authorize(__dirname + '/../config/autobackups-1533129260452-637dd11cdc99.json',['https://www.googleapis.com/auth/drive']);
google.downloadFile(auth,fileId,dest).catch(console.error);;
