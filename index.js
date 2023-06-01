const { connectToSFTP, executeProgram } = require('./sftp');
const { processDataFile } = require('./data');

// 连接到SFTP服务器
connectToSFTP()
    .then(() => {
        executeProgram();
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
    });