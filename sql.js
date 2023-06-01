const mysql = require('mysql');

// 创建数据库连接配置
const connection = mysql.createConnection({
    host: 'localhost',       // 数据库主机名
    user: 'test',   // 数据库用户名
    password: '123qwe123', // 数据库密码
    database: 'sftp' // 数据库名称
});

function LinkDatabase(){
    connection.connect((error) => {
        if (error) {
            console.error('无法连接到数据库:', error);
        } else {
            console.log('成功连接到数据库');
            // 在这里执行你的数据库操作
        }
    });
}

function endSQL(){
    connection.end((error) => {
        if (error) {
            console.error('关闭数据库连接时出错:', error);
        } else {
            console.log('成功关闭数据库连接');
        }
    });
}

function querySQL(CMD) {
    LinkDatabase();
    connection.query(CMD, (error, results, fields) => {
        if (error) {
            console.error('查询数据库时出错:', error);
            endSQL();
            return NULL;
        } else {
//            console.log('查询结果:', results);
            endSQL();
            return results;
        }
    });
}

module.exports = querySQL;
