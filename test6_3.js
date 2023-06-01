const csv = require('fast-csv');
const fs = require('fs');

const filePath = './client_file/ID_SSD_20230510031010.csv';
const csvString = fs.readFileSync(filePath, 'utf-8');

// const csvString = `John,25,New York
// Alice,30,San Francisco
// Bob,35,Chicago`;

const results = []; // 存储处理后的数据

csv
    .parseString(csvString, { headers: false })
    .on('data', (data) => {
        // 处理每一行数据
        results.push(data);
    })
    .on('end', () => {
        // CSV字符串解析完成
        console.log('CSV字符串处理完成');
        console.log(results); // 打印处理后的数据

        // 在这里可以对results数组进行进一步的操作，如筛选、修改等
        // ...
    });
