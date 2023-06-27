// const { processID_SSD_Deal, processID_SSDM_Deal, processIM_ISP, processIM_KOJYO, processID_SMP, processID_SSD_KOJYO } = require('./data');
const Client = require('ssh2-sftp-client');
const data_processing = require('./data');

const sftp = new Client();

// const config = {
//     host: '120.27.20.169',
//     port: '22',
//     username: 'sftp',
//     password: '1122'
// };

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

// 用于存储已检测到的文件列表
let fileCache = [];

// 是否是第一次扫描
// let isFirstScan = true;
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
            console.log(file.name);

            sftp.get(remoteDirPath + file.name, localDirPath + file.name);

            const lastIndex = file.name.lastIndexOf('_');
            if (lastIndex !== -1) {
                const dataInterface = file.name.substring(0, lastIndex);

                switch (dataInterface) {
                    case 'IM_ISP':
                        setTimeout(() => data_processing.processIM_ISP(localDirPath + file.name), 3000);
                        break;
                    case 'IM_KOJYO':
                        setTimeout(() => data_processing.processIM_KOJYO(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SMP':
                        setTimeout(() => data_processing.processID_SMP(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSD':
                        setTimeout(() => data_processing.processID_SSD_Deal(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSDM':
                        setTimeout(() => data_processing.processID_SSDM_Deal(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSD_KOJYO':
                        setTimeout(() => data_processing.processID_SSD_KOJYO(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSD_ISP':
                        setTimeout(() => data_processing.processID_SSD_ISP(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SMP_CMT':
                        setTimeout(() => data_processing.processID_SMP_CMT(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSD_CMT':
                        setTimeout(() => data_processing.processID_SSD_CMT(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SMPPROG_YOT':
                        setTimeout(() => data_processing.processID_SMPPROG_YOT(localDirPath + file.name), 3000);
                        break;
                    case 'ID_SSDPROG_YOT':
                        setTimeout(() => data_processing.processID_SSDPROG_YOT(localDirPath + file.name), 3000);
                        break;
                    default:
                        console.log("未知文件");
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
            console.log("删除" + file);
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

// module.exports = {
//     connectToSFTP,
//     executeProgram
// };


connectToSFTP()
    .then(() => {
        executeProgram();
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
    });