const fs = require('fs');
const csv = require('fast-csv');
const axios = require('axios');


const filePath = './client_file/ID_SSD_20230510031010.csv';

const results = []; // 存储处理后的数据

function convertToUTCDate(dateStr) {
    const date = new Date(dateStr);
    date.setUTCHours(date.getUTCHours() + 8);
    const formattedDate = date.toISOString();
    return formattedDate;
}

fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: false }))
    .on('data', (data) => {
        // 处理每一行数据
        results.push(data);
    })
    .on('end', () => {
        // CSV文件解析完成
        console.log('CSV文件处理完成');
        console.log(results); // 打印处理后的数据
        console.log(results[1][4]); // 打印处理后的数据

        // 在这里可以对results数组进行进一步的操作，如筛选、修改等
        // ...

        results.forEach(Line => {
            const data = {
                data: {
                    _widget_1685584989914: { value: Line[0] },
                    _widget_1685584989915: { value: convertToUTCDate(Line[2]) },
                    _widget_1685584989916: { value: Line[5] },
                    _widget_1685584989918: { value: Line[7] },
                    _widget_1685584989919: { value: Line[12] },
                    _widget_1685584989920: { value: Line[13] },
                    _widget_1685584989921: { value: Line[17] },
                    _widget_1685584989926: { value: Line[19] },
                    _widget_1685584989928: { value: Line[27] },
                    _widget_1685584989930: { value: convertToUTCDate(Line[29]) }
                },
                is_start_workflow: true,
                is_start_trigger: true
            };
            console.log(data);
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
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
        })
    })
    .on('error', (error) => {
        console.error('读取CSV文件时发生错误:', error);
    });
