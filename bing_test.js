const Client = require('ssh2-sftp-client');

const sftp = new Client();

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

// 定期检查目录变动

function printf(list) {
    console.log(list)
}

function checkDirectoryChanges() {
    sftp.list(remoteDirPath).then(files => {
        // 检查新增文件 
        printf(files)
        files.forEach(
            file => {
                if (!fileCache.includes(file.name)) {
                    fileCache.push(file.name);
                    // 添加一个判断条件，如果是第一次启动，不输出新增文件 
                    if (isFirstStart) {
                        console.log('新增文件:', file.name);
                    }
                }
            });

        // 检查删除文件 
        fileCache.forEach(
            file => {
                if (!files.find(f => f.name === file)) {
                    fileCache = fileCache.filter(f => f !== file);
                    // 添加一个判断条件，如果是第一次启动，不输出删除文件 
                    if (isFirstStart) {
                        console.log('删除文件:', file);
                    }
                }
            });
        // 修改isFirstStart为false，表示已经完成第一次扫描 
        isFirstStart = false;
    }).catch(err => {
        console.error('无法获取远程目录列表:', err);
    });
}

// 连接到SFTP服务器 
sftp.connect(config).then(() => {
    // 添加一个变量，用于标记是否是第一次启动 
    let isFirstStart = true;
    // 开始定期检查目录变动 
    setInterval(checkDirectoryChanges, 5000);
    // 5秒钟检查一次 
}).catch(err => {
    console.error('连接SFTP服务器失败:', err);
});