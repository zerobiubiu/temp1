// const fs = require('fs');
// const csv = require('csv-parser');

// const Path ="./client_file/ID_SSD_20230510031010.csv"
// console.log(Path)
// const results = [];
// fs.createReadStream(Path)
//     .pipe(csv())
//     .on('data', (data) => {
//         // 处理每一行数据
//         results.push(data);
//     })
//     .on('end', () => {
//         // CSV文件解析完成
//         console.log(results);
//     });

const fs = require('fs');
const readline = require('readline');
const csv = require('fast-csv');

const filePath = './client_file/ID_SSD_20230510031010.csv';

// 创建可读流
const stream = fs.createReadStream(filePath);

// 创建逐行读取的接口
const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // 处理不同换行符的情况
});
const dataArray = [];
// 按行读取CSV文件
rl.on('line', (line) => {
    // 处理每一行数据
    console.log(line);
    dataArray.push(line);
});

dataArray.forEach(csvString, () => {
    const results = [];
    csv.parseString(csvString, { headers: false })
        .on('data', (data) => {
            // 处理每一行数据
            results.push(data);
        })
        .on('end', () => {
            // CSV字符串解析完成
            
        });
})


// 当文件读取完成时
rl.on('close', () => {
    console.log('CSV文件读取完成');
    console.log(dataArray);
});
