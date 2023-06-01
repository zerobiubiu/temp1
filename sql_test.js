const mysql = require('mysql');

// 创建数据库连接配置
const connection = mysql.createConnection({
    host: 'localhost',       // 数据库主机名
    user: 'test',   // 数据库用户名
    password: '123qwe123', // 数据库密码
    database: 'sftp' // 数据库名称
});

CMD = "SELECT * FROM `sftp`.`filecache`"

connection.connect((error) => {
    if (error) {
        console.error('无法连接到数据库:', error);
    } else {
        console.log('成功连接到数据库');
        // 在这里执行你的数据库操作
    }
});


connection.query(CMD, (error, results, fields) => {
    if (error) {
        console.error('查询数据库时出错:', error);
    } else {
        console.log(results);

        results.forEach(res => {
            console.log(res)
        })

        const dataArray = results.map(row => Object.values(row).toString());

        // let Arry = [];
        // // 打印数组
        console.log(dataArray);
        // //console.log(dataArray[0].toString());
        // dataArray.forEach(data => {
        //     Arry.push(data.toString());
        //     console.log(data.toString())
        // })
        // console.log(Arry);
    }
});

connection.end((error) => {
    if (error) {
        console.error('关闭数据库连接时出错:', error);
    } else {
        console.log('成功关闭数据库连接');
    }
});

