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
function processID_SSD_Deal(path) {
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
                    console.log(JSON.stringify(response.data));
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });
}

function processID_SSDM_Deal(path) {


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

    function splitAndRecombineValues(jsonData) {
        var buffer = [];
        for (const key in jsonData) {
            const rows = jsonData[key];
            rows.forEach((line) => {
                buffer.push({
                    _widget_1685598573915: { value: line[0] + line[2] },
                    _widget_1685598573916: { value: line[1] },
                    _widget_1685598573917: { value: line[3] }
                })
            });
        }
        return buffer;
    }

    convertCsvToJson(path, (error, JsonData) => {
        if (error) {
            console.error('无法将 CSV 文件转换为 JSON:', error);
            return;
        }

        Object.entries(JsonData).map(([key, value]) => {
            const line = { [key]: value };
            const keys = Object.keys(line);
            const data = {
                data: {
                    _widget_1685598573914: { value: keys[0] },
                    _widget_1685598573912: {
                        value: splitAndRecombineValues(line)
                    }
                },
                is_start_workflow: true,
                is_start_trigger: true
            };

            const config = {
                method: 'post',
                url: 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/6478316df3f50400082f425b/data_create',
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
                    console.log(JSON.stringify(response.data));
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });
}

module.exports = {
    processID_SSD_Deal,
    processID_SSDM_Deal
};
