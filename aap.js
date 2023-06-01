let Client = require('ssh2-sftp-client');
let fs = require('fs')
let sftp = new Client();

const config = {
    host: '119.23.139.51',
    port: '22',
    username: 'S59353018',
    password: '88123456'
};

// let data = fs.createReadStream('./resources/ID_SSD_20230510031010.csv');
// let remote = '/send/ID_SSD_20230510031010.csv';

// let remotePath = '/send/ID_SSD_20230510031010.csv';
// let dst = fs.createWriteStream('./resources/remoteFile.csv');

// sftp.connect(config)
//     .then(() => {
//         return sftp.put(data, remote);
//     })
//     .then(() => {
//         sftp.end()
//     })
//     .catch(err => {
//         console.log(err, 'catch error');
//     });

// sftp.connect(config)
//     .then(() => {
//         return sftp.get(remotePath, dst);
//     })
//     .then(() => {
//         sftp.end()
//     })
//     .catch(err => {
//         console.log(err, 'catch error');
//     });

sftp.connect(config)
    .then(() => {
        return sftp.exists('/send');
    }).then(p => {
        console.log(p);
        return sftp.end();
    })
    .catch(err => {
        console.log(err, 'catch error');
    });

