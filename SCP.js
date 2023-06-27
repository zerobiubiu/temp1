const { NodeSSH } = require('node-ssh');
const fs = require('fs');

const config = {
    host: '47.98.46.251',
    port: 22,
    username: 'S59353018',
    password: '88123456',
    algorithms: {
        kex: ['diffie-hellman-group1-sha1', 'diffie-hellman-group14-sha1'],
        serverHostKey: ['ssh-rsa']
    }
};

async function SCP(name) {
    const ssh = new NodeSSH(); // 在每次调用时创建新的实例
    const remoteFilePath = '/send/' + name;
    const localFilePath = './client_file/' + name;
    try {
        if (!fs.existsSync('./client_file/')) {
            fs.mkdirSync('./client_file/', { recursive: true });
        }
        await ssh.connect(config);
        await ssh.getFile(localFilePath, remoteFilePath);
        console.log('文件成功复制到本地');
        ssh.dispose();
    } catch (err) {
        console.error('SCP操作失败:', err);
    }
}

module.exports = SCP;
