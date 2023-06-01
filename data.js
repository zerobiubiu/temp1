const fs = require('fs');
const csv = require('fast-csv');
const axios = require('axios');

// 日期格式转换
function convertToUTCDate(dateStr) {
    const date = new Date(dateStr);
    date.setUTCHours(date.getUTCHours() + 8);
    const formattedDate = date.toISOString();
    return formattedDate;
}

// 处理数据文件
function processDataFile(path) {
    const results = [];

    const csvString = fs.readFileSync(path, 'utf-8');

    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });

    csvStream.on('end', () => {
        results.forEach(line => {
            const data = {
                data: {
                    _widget_1685584989914: { value: line[0] },
                    _widget_1685584989915: { value: convertToUTCDate(line[2]) },
                    _widget_1685584989916: { value: line[5] },
                    _widget_1685584989918: { value: line[7] },
                    _widget_1685584989919: { value: line[12] },
                    _widget_1685584989920: { value: line[13] },
                    _widget_1685584989921: { value: line[17] },
                    _widget_1685584989926: { value: line[19] },
                    _widget_1685584989928: { value: line[27] },
                    _widget_1685584989930: { value: convertToUTCDate(line[29]) }
                },
                is_start_workflow: true,
                is_start_trigger: true
            };

            const config = {
                method: 'post',
                url: 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/6477fc5d266775000815b118/data_create',
                headers: {
                    Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    Host: 'api.jiandaoyun.com',
                    Connection: 'keep-alive'
                },
                data
            };

            axios(config)
                .then(response => {
                    // console.log(JSON.stringify(response.data));
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    return new Promise((resolve, reject) => {
        csvStream.on('finish', () => {
            resolve();
        });
        csvStream.on('error', error => {
            reject(error);
        });
    });
}

module.exports = {
    processDataFile
};
