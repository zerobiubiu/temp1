const Client = require('ssh2-sftp-client');
const OD_SSDPROG = require('./module/OD_SSDPROG');
const OD_SSDPROG_JIS = require('./module/OD_SSDPROG_JIS');
const OD_SMPPROG_YOT = require("./module/OD_SMPPROG_YOT")
const OD_SMPPROG_JIS = require("./module/OD_SMPPROG_JIS")

// SFTP服务器配置
// const config = {
//     host: '120.27.20.169',
//     port: '22',
//     username: 'sftp',
//     password: '1122'
//     // username: 'root',
//     // password: 'TGp6sJ7rKm'
// };
const config = {
    host: '47.98.46.251',
    port: '22',
    username: 'S59353018',
    password: '88123456',
    algorithms: {
        kex: ['diffie-hellman-group1-sha1', 'diffie-hellman-group14-sha1'],
        serverHostKey: ['ssh-rsa']
    }
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

        console.log("执行OD_SSDPROG_YOT_1查询。" + new Date());
        let fileName = await OD_SSDPROG.work();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_YOT_1推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_YOT_2查询。" + new Date());
        fileName = await OD_SSDPROG.startAccessory();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_YOT_2推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_YOT_3查询。" + new Date());
        fileName = await OD_SSDPROG.startSendSample();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_YOT_3推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_YOT_4查询。" + new Date());
        fileName = await OD_SSDPROG.startFabricArrival();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_YOT_4推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SMPPROG_YOT查询。" + new Date());
        fileName = await OD_SMPPROG_YOT.start();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SMPPROG_YOT推送。" + new Date());
        await uploadFile(fileName);

        /////////
        console.log("执行OD_SSDPROG_JIS_1查询。" + new Date());
        fileName = await OD_SSDPROG_JIS.work();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_JIS_1推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_JIS_2查询。" + new Date());
        fileName = await OD_SSDPROG_JIS.startAccessory();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_JIS_2推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_JIS_3查询。" + new Date());
        fileName = await OD_SSDPROG_JIS.startSendSample();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_JIS_3推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SSDPROG_JIS_4查询。" + new Date());
        fileName = await OD_SSDPROG_JIS.startFabricArrival();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SSDPROG_JIS_4推送。" + new Date());
        await uploadFile(fileName);

        console.log("执行OD_SMPPROG_JIS查询。" + new Date());
        fileName = await OD_SMPPROG_JIS.start();
        // 延迟 5 秒后执行上传
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("执行OD_SMPPROG_JIS推送。" + new Date());
        await uploadFile(fileName);

        // 轮询等待
        console.log(new Date() + " 轮询进入等待时间");
        await new Promise((resolve) => setTimeout(resolve, (3600 * 1000)));
        loopCount++;
    }
}

// 启动数据推送任务
startInterval();