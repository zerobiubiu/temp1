const Client = require('ssh2-sftp-client');
const mysql = require('mysql');

const sftp = new Client();

// SFTP连接配置
const sftpConfig = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

// MySQL连接配置
const mysqlConfig = {
    host: 'localhost',       // 数据库主机名
    user: 'test',   // 数据库用户名
    password: '123qwe123', // 数据库密码
    database: 'sftp' // 数据库名称
};

// 创建数据库连接池
const connection = mysql.createPool(mysqlConfig);

// 监听的远程目录路径
const remoteDirPath = './send/';

// 用于存储已检测到的文件列表
let fileCache = [];

// 从数据库加载文件缓存
async function loadFileCache() {
    try {
        const results = await executeQuery("SELECT * FROM `sftp`.`filecache`");
        fileCache = results.map(row => Object.values(row).toString());
        console.log("加载上次结束前的内容: " + fileCache);
    } catch (error) {
        console.error('查询数据库时出错:', error);
    }
}

// 执行 SQL 查询
function executeQuery(query, values = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// 检查目录变动
async function checkDirectoryChanges() {
    try {
        const files = await sftp.list(remoteDirPath);

        // 检查新增文件
        for (const file of files) {
            if (!fileCache.includes(file.name)) {
                fileCache.push(file.name);
                try {
                    await executeQuery("INSERT INTO `filecache` (`Path`) VALUES (?)", [file.name]);
                    console.log('新增文件:', file.name);
                } catch (error) {
                    console.error('Error executing query:', error);
                }
            }
        }

        // 检查删除文件
        for (const file of fileCache) {
            if (!files.find(f => f.name === file)) {
                fileCache = fileCache.filter(f => f !== file);
                try {
                    await executeQuery("DELETE FROM `filecache` WHERE `Path` = ?", [file]);
                    console.log('删除文件:', file);
                } catch (error) {
                    console.error('Error executing query:', error);
                }
            }
        }
    } catch (err) {
        console.error('无法获取远程目录列表:', err);
    }
}

// 连接到SFTP服务器
sftp.connect(sftpConfig)
    .then(async () => {
        await loadFileCache(); // 加载文件缓存

        // 开始定期检查目录变动
        const interval = setInterval(checkDirectoryChanges, 5000); // 5秒钟检查一次

        // 程序结束时关闭数据库连接和定时器
        process.on('SIGINT', () => {
            clearInterval(interval);
            connection.end((error) => {
                if (error) {
                    console.error('关闭数据库连接时出错:', error);
                }
                sftp.end();
                process.exit();
            });
        });
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
        connection.end((error) => {
            if (error) {
                console.error('关闭数据库连接时出错:', error);
            }
            sftp.end();
            process.exit(1);
        });
    });

