const Client = require('ssh2-sftp-client');

const sftp = new Client();

// SFTP连接配置
const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

// 监听的远程目录路径
const remoteDirPath = './send/';

// 用于存储已检测到的文件列表
let fileCache = [];

// 是否是第一次扫描
let isFirstScan = true;

// 定期检查目录变动
function checkDirectoryChanges() {
    sftp.list(remoteDirPath)
        .then(files => {
            // 检查新增文件
            if (!isFirstScan) {
                files.forEach(file => {
                    if (!fileCache.includes(file.name)) {
                        fileCache.push(file.name);
                        console.log('新增文件:', file.name);
                    }
                });
            }

            // 检查删除文件
            if (!isFirstScan) {
                fileCache.forEach(file => {
                    if (!files.find(f => f.name === file)) {
                        fileCache = fileCache.filter(f => f !== file);
                        console.log('删除文件:', file);
                    }
                });
            }

            // 第一次扫描完成，将 isFirstScan 设置为 false
            isFirstScan = false;
        })
        .catch(err => {
            console.error('无法获取远程目录列表:', err);
        });
}

// 连接到SFTP服务器
sftp.connect(config)
    .then(() => {
        // 执行一次目录变动检查
        checkDirectoryChanges();

        // 开始定期检查目录变动
        setInterval(checkDirectoryChanges, 5000); // 5秒钟检查一次
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
    });
