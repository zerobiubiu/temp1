const Client = require('ssh2-sftp-client');

const sftp = new Client();

const config = {
    // host: '119.23.139.51',
    host: '47.98.46.251',
    port: '22',
    username: 'S59353018',
    password: '88123456',
    algorithms: {
        kex: ['diffie-hellman-group1-sha1', 'diffie-hellman-group14-sha1'],
        serverHostKey: ['ssh-rsa']
    }
};

// 监听的远程目录路径
const remoteDirPath = './send/';
const localDirPath = './client_file/';

const name = "ID_SSDM_20230626110143161.csv";

sftp.connect(config).then(()=>{
    sftp.get(remoteDirPath + name, localDirPath + name);
})



