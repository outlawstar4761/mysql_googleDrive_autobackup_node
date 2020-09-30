/*SOMETHING TO KEEP IN MIND HERE: WE ARE RESOLVING STDOUT.
IF YOUR COMMAND DOESN'T RESULT IN ANY OUTPUT, YOUR ASYNC RETURN WILL BE EMPTY.
*/
var mysqlModule = (function(){
  const {exec} = require('child_process');
  const OUTDIR = __dirname + '/../out/';

  let _user = '';
  let _pass = '';

  function _execShellCmd(cmd){
    return new Promise((resolve,reject)=>{
      exec(cmd,(err,stdout,stderr)=>{
        if(err) reject(err);
        if(stderr) reject(stderr);
        resolve(stdout);
      });
    });
  }
  async function _deleteFile(absolutePath){
    let cmd = 'rm ' + absolutePath;
    return _execShellCmd(cmd);
  }
  async function _backupDB(dbname){
    let outFile = OUTDIR + dbname + '.sql';
    let cmd = 'mysqldump --user=' + _user + ' --password=' + _pass + ' ' + dbname + ' > ' + outFile;
    return _execShellCmd(cmd);
  }
  async function _encryptOutput(absolutePath,passphrase){
    let cmd = 'gpg -c --batch --passphrase=' + passphrase + ' ' + absolutePath;
    return _execShellCmd(cmd);
  }
  return {
    user:_user,
    pass:_pass,
    setUser:function(user,pass){
      _user = user;
      _pass = pass;
      this.user = _user;
      this.pass = _pass;
    },
    backupDB:async function(dbname){
      if(this.user == '' || this.pass == ''){
        throw new Error('Unable to execute before setting username and password');
      }
      return _backupDB(dbname);
    },
    encryptOutput:async function(absolutePath,passphrase){
      return _encryptOutput(absolutePath,passphrase);
    },
    getOutPath:function(dbname){
      return OUTDIR + dbname + '.sql';
    }
  }
}());

module.exports = mysqlModule;
