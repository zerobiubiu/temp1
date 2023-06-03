const Client = require('ssh2-sftp-client');
const OD_SSDPROG = require('./module/OD_SSDPROG');

// SFTP服务器配置
const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
    // username: 'root',
    // password: 'TGp6sJ7rKm'
};

// 循环计数器
var loopCount = 1;

// 当前时间
const now = new Date();

// 远程目录路径
const remoteDirPath = './receive/';

// 本地目录路径
const localDirPath = './output/';

/**
 * 将本地文件上传到SFTP服务器
 * @param {string} localFilePath - 本地文件路径
 * @param {string} remoteFilePath - 远程文件路径
 */
async function uploadFileToSFTP(localFilePath, remoteFilePath) {
    const sftp = new Client();

    try {
        await sftp.connect(config);
        await sftp.put(localFilePath, remoteFilePath);
        console.log('文件上传成功');
    } catch (err) {
        console.error('文件上传失败:', err);
    } finally {
        sftp.end();
    }
}

/**
 * 上传文件到SFTP服务器
 * @param {string} fileName - 文件名
 */
async function uploadFile(fileName) {
    const localFile = localDirPath + fileName;
    const remoteFile = remoteDirPath + fileName;
    await uploadFileToSFTP(localFile, remoteFile);
}

/**
 * 启动数据推送任务
 */
async function startInterval() {
    console.log(now + "  启动数据推送。");
    while (true) {
        console.log(new Date() + " 执行第" + loopCount + "次查询。");
        console.log("执行OD_SSDPROG查询。" + new Date());
        const fileName = await OD_SSDPROG();
        console.log("执行OD_SSDPROG推送。" + new Date());
        await uploadFile(fileName);

        // 延迟等待 9995 秒
        await new Promise((resolve) => setTimeout(resolve, 9995000));
        loopCount++;
    }
}

// 启动数据推送任务
startInterval();
