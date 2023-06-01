const mysql = require('mysql');

// 创建数据库连接配置
const connection = mysql.createConnection({
    host: 'localhost',       // 数据库主机名
    user: 'test',   // 数据库用户名
    password: '123qwe123', // 数据库密码
    database: 'sftp' // 数据库名称
});

function querySQL(CMD) {
    return new Promise((resolve, reject) => {
        connection.query(CMD, (error, results, fields) => {
            if (error) {
                console.error('查询数据库时出错:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = querySQL;