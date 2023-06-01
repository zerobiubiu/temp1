const fs = require('fs');
const csv = require('fast-csv');

function convertCsvToJson(csvFilePath, callback) {
    const jsonData = {};

    fs.createReadStream(csvFilePath)
        .pipe(csv.parse({ headers: false }))
        .on('data', (data) => {
            const key = data[0];
            const restFields = data.slice(1);

            if (jsonData.hasOwnProperty(key)) {
                jsonData[key].push(restFields);
            } else {
                jsonData[key] = [restFields];
            }
        })
        .on('end', () => {
            callback(null, jsonData);
        })
        .on('error', (error) => {
            callback(error);
        });
}

// 使用示例
const csvFilePath = './client_file/ID_SSDM_20230510031010.csv';
convertCsvToJson(csvFilePath, (error, jsonData) => {
    if (error) {
        console.error('无法将 CSV 文件转换为 JSON:', error);
        return;
    }

    console.log(jsonData);
});
