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

function processIM_ISP(path) {
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168671266992" + index] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/6489315d3036570008175d93/data_batch_create',
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
}

function processIM_KOJYO(path) {
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168672210053" + (index + 1)] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/648956342e6170000738d891/data_batch_create',
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
}

function processID_SMP(path) {
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        const json = {
            "_widget_1686722540825": { "value": data[0] },
            "_widget_1686722540826": { "value": data[1] },
            "_widget_1686722540827": { "value": data[2] },
            "_widget_1686722540828": { "value": data[3] },
            "_widget_1686722540829": { "value": data[4] },
            "_widget_1686722540830": { "value": data[5] },
            "_widget_1686722540831": { "value": data[6] },
            "_widget_1686722540832": { "value": data[7] },
            "_widget_1686722540833": { "value": convertToUTCDate(data[8]) },
            "_widget_1686722540834": { "value": data[9] },
            "_widget_1686722540835": { "value": data[10] },
            "_widget_1686722540836": { "value": data[11] },
            "_widget_1686722540837": { "value": data[12] },
            "_widget_1686722540838": { "value": data[13] },
            "_widget_1686722540839": { "value": data[14] },
            "_widget_1686722540840": { "value": data[15] },
            "_widget_1686722540841": { "value": data[16] },
            "_widget_1686722540842": { "value": data[17] }
        };

        results.push(json);
    });

    csvStream.on('end', () => {
        const data = {
            "data_list": results
        };
        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/648957ec03a020000810c99b/data_batch_create',
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
}

function processID_SSD_KOJYO(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168672375047" + (index + 5)] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/64895ca61d364700085a048f/data_batch_create',
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
}

function processID_SSD_ISP(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168672432830" + (index + 0)] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/64895ee72d40e6000804e1d7/data_batch_create',
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
}

function processID_SMP_CMT(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168672468568" + (index + 6)] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/6489604d77eb9d0008cccda1/data_batch_create',
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
}

function processID_SSD_CMT(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        results.push(data);
    });
    csvStream.on('end', () => {
        const data = {
            "data_list": results.map(row => {
                const widget = {};
                row.forEach((value, index) => {
                    widget["_widget_168672493471" + (index + 7)] = {
                        "value": value
                    };
                });
                return widget;
            })
        };

        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/648961445e413f00071f6e19/data_batch_create',
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
}

function processID_SMPPROG_YOT(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        const json = {
            "_widget_1686726286595": { "value": data[0] },
            "_widget_1686726286596": { "value": data[1] },
            "_widget_1686726286597": { "value": data[2] },
            "_widget_1686726286598": { "value": convertToUTCDate(data[3]) }
        };

        results.push(json);
    });

    csvStream.on('end', () => {
        const data = {
            "data_list": results
        };
        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/6489668e77eb9d0008d2cccd/data_batch_create',
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
}

function processID_SSDPROG_YOT(path){
    const results = [];
    const csvString = fs.readFileSync(path, 'utf-8');
    const csvStream = csv.parseString(csvString, { headers: false });

    csvStream.on('data', data => {
        const json = {
            "_widget_1686726725078": { "value": data[0] },
            "_widget_1686726725079": { "value": data[1] },
            "_widget_1686726725080": { "value": convertToUTCDate(data[2]) }
        };

        results.push(json);
    });

    csvStream.on('end', () => {
        const data = {
            "data_list": results
        };
        const config = {
            method: 'post',
            url: 'https://api.jiandaoyun.com/api/v1/app/612613ce863d82000717504f/entry/648968449bee8400080f800d/data_batch_create',
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
}

module.exports = {
    processID_SSD_Deal,
    processID_SSDM_Deal,
    processIM_ISP,
    processIM_KOJYO,
    processID_SMP,
    processID_SSD_KOJYO,
    processID_SSD_ISP,
    processID_SMP_CMT,
    processID_SSD_CMT,
    processID_SMPPROG_YOT,
    processID_SSDPROG_YOT
};
