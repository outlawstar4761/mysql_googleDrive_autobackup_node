# MyGpgDrive

## Preamble
I wanted to automate offsite backups of my MySql databases with Google Drive. However, I didn't want Google to be able to freely parse the contents of my databases. I set about doing this by combining [MySql cli](https://www.mysql.com/), [GnuPG](https://gnupg.org/) and [Google Drive API](https://developers.google.com/drive).
This package provides access to 2 modules. googleModule exposes some methods for performing basic Google Drive operations and mysqlModule executes mysql and gpg related shell commands.

Remember, you will need to provide your own ./config/credentials.json

### Reporting performance or availability problems

Report performance/availability at our [support site](mailto:j.watson@outlawdesigns.io).

### Reporting bugs, requesting features

Please report bugs with the module or documentation on our [issue tracker]().
