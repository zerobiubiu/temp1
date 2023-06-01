const Client = require('ssh2-sftp-client');
const fs = require('fs');

const sftp = new Client();

const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

// 监听的远程目录路径
const remoteDirPath = './send/';
const localDirPath = './client_file/';

// 用于存储已检测到的文件列表
let fileCache = [];

// 是否是第一次扫描
let isFirstScan = true;

// 连接到SFTP服务器
function connectToSFTP() {
    return sftp.connect(config);
}

// 从SFTP服务器获取文件列表
function getRemoteFiles() {
    return sftp.list(remoteDirPath);
}

// 初始化查询目录
function initializeFileCache(files) {
    if (isFirstScan) {
        files.forEach(file => {
            fileCache.push(file.name);
        });
        isFirstScan = false;
    }
}

// 处理新增文件
function handleNewFiles(files) {
    files.forEach(file => {
        if (!fileCache.includes(file.name)) {
            fileCache.push(file.name);
            sftp.get(remoteDirPath + file.name, localDirPath + file.name);
            const lastIndex = file.name.lastIndexOf('_');
            if (lastIndex !== -1) {
                const dataInterface = file.name.substring(0, lastIndex);
                console.log(dataInterface);
                switch (dataInterface) {
                    case 'IM_ISP':
                        break;
                    case 'IM_KOJYO':
                        break;
                    case 'ID_SMP':
                        break;
                    case 'ID_SSD':
                        processDataFile(localDirPath + file.name)
                            .catch(error => {
                                console.error(error);
                            });
                        break;
                    case 'ID_SSDM':
                        break;
                    case 'ID_SSD_KOJYO':
                        break;
                    case 'ID_SSD_ISP':
                        break;
                    case 'ID_SMP_CMT':
                        break;
                    case 'ID_SMPPROG_YOT':
                        break;
                    case 'ID_SSDPROG_YOT':
                        break;
                    default:
                        break;
                }
            }
        }
    });
}

// 处理删除文件
function handleDeletedFiles(files) {
    fileCache.forEach(file => {
        if (!files.find(f => f.name === file)) {
            fileCache = fileCache.filter(f => f !== file);
        }
    });
}

// 定期检查目录变动
function checkDirectoryChanges() {
    getRemoteFiles()
        .then(files => {
            initializeFileCache(files);
            handleNewFiles(files);
            handleDeletedFiles(files);
        })
        .catch(err => {
            console.error('无法获取远程目录列表:', err);
        });
}

// 执行主程序
function executeProgram() {
    checkDirectoryChanges();
    setInterval(checkDirectoryChanges, 5000); // 5秒钟检查一次
}

module.exports = {
    connectToSFTP,
    executeProgram
};
