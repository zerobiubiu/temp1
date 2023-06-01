const Client = require('ssh2-sftp-client');

const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

const sftp = new Client();

sftp.connect(config)
    .then(() => {
        return sftp.list('./');
    })
    .then((data) => {
        console.log('Directory contents:', data);
    })
    .catch((err) => {
        console.error('Error:', err);
    })
    .finally(() => {
        sftp.end();
    });
