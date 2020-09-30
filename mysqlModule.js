var mysqlModule = (function(){
  const {exec} = require('child_process');
  const THISDIR = __dirname + '/';

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
  function _deleteFile(absolutePath){
    let cmd = 'rm ' + absolutePath;
    return _execShellCmd(cmd);
  }
  function _backupDB(dbName){
    let outFile = THISDIR + dbName + '.sql';
    let cmd = 'mysqldump --user=' + user + ' --password=' + pass + ' ' + dbName + ' > ' + outFile;
    return _execShellCmd(cmd);
  }
  function _encryptOutput(absolutePath,passphrase){
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
    backupDB:function(dbname){
      if(this.user == '' || this.pass == ''){
        throw new Error('Unable to execute before setting username and password');
      }
      return _backupDB(dbName);
    },
    encryptOutput:function(absolutePath,passphrase){
      return _encryptOutput(absolutePath,passphrase);
    }
  }
}());

module.exports = mysqlModule;
