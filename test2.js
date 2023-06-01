const Client = require('ssh2-sftp-client');
const mysql = require('mysql');

const sftp = new Client();

// SFTP连接配置
const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

// 创建数据库连接配置
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: '123qwe123',
    database: 'sftp'
});
connection.connect();

// 监听的远程目录路径
const remoteDirPath = './send/';

// 用于存储已检测到的文件列表
let fileCache = [];

// 从数据库中加载上次结束前的内容
connection.query("SELECT * FROM sftp.filecache", (error, results, fields) => {
    if (error) {
        console.error('查询数据库时出错:', error);
    } else {
        fileCache = results.map(row => Object.values(row).toString());
        console.log("加载上次结束前的内容" + fileCache);
    }
});

// 定期检查目录变动
function checkDirectoryChanges() {
    sftp.list(remoteDirPath)
        .then(files => {
            // 检查新增文件
            files.forEach(file => {
                if (!fileCache.includes(file.name)) {
                    fileCache.push(file.name);
                    connection.query("INSERT INTO filecache (Path) VALUES ('" + file.name + "')", (error) => {
                        if (error) {
                            console.error('Error executing query:', error);
                        }
                    });
                    console.log('新增文件:', file.name);
                }
            });

            // 检查删除文件
            fileCache.forEach(file => {
                if (!files.find(f => f.name === file)) {
                    fileCache = fileCache.filter(f => f !== file);
                    connection.query("DELETE FROM `filecache` WHERE `Path` = '" + file + "'", (error) => {
                        if (error) {
                            console.error('Error executing query:', error);
                        }
                    });
                    console.log('删除文件:', file);
                }
            });
        })
        .catch(err => {
            console.error('无法获取远程目录列表:', err);
        });
}

// 连接到SFTP服务器
sftp.connect(config)
    .then(() => {
        // 开始定期检查目录变动
        setInterval(checkDirectoryChanges, 5000); // 5秒钟检查一次
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
    });