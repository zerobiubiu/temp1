const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');


// ====================== 通用函数 ========================


// 日志需要的变量
var logFilename = [];
const logLocalDirPath = './logs/';
var logFileDirPath = [];
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Shanghai',
    timeZoneName: 'short'
};
var formatter = new Intl.DateTimeFormat('zh-CN', options);

// 日志准备函数
function logTime() {
    const year = new Date().getFullYear().toString().padStart(4, '0');
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const seconds = new Date().getSeconds().toString().padStart(2, '0');
    const timestamp = `${year}.${month}.${day}_${hours}${minutes}${seconds}`;
    logFilename = `OD_SSDPROG_YOT${timestamp}.log`;
    logFileDirPath = logLocalDirPath + logFilename;

    console.log("生成日志文件：" + logFileDirPath);

    formatter = new Intl.DateTimeFormat('zh-CN', options);

    if (!fs.existsSync(logLocalDirPath)) {
        fs.mkdirSync(logLocalDirPath, { recursive: true });
        console.log('目录已创建');
    }
}

// 日志函数
async function writeLogToFile(log) {
    try {
        await fs.promises.appendFile(logFileDirPath, log + '\n');
    } catch (err) {
        console.error('写入日志文件时发生错误:', err);
    }
}

// 将数据写入CSV文件的函数
function writeCSVToFile(csvData) {
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    const localDirPath = "./output/";
    const filename = `OD_SMPPROG_YOT_${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}${new Date().getSeconds().toString().padStart(2, '0')}.csv`;
    const fileDirPath = localDirPath + filename;

    let csvContent = '';
    for (const row of csvData) {
        const date = new Date(row[row.length-1]);
        const formattedDate = `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        row[row.length-1] = formattedDate;
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    }

    try {
        if (!fs.existsSync(localDirPath)) {
            fs.mkdirSync(localDirPath, { recursive: true });
        }

        fs.writeFileSync(fileDirPath, csvContent, 'utf8');

        writeLogToFile("---文件写入成功---");
        writeLogToFile("文件地址：" + fileDirPath);

        return filename;
    } catch (err) {
        console.error('写入 CSV 文件时发生错误：', err);
        return null;
    }
}


// ====================== 获取客户名 ========================

const clientName = [];
async function screenClientContacts(dataId) {
    const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/61461fae0eaa80000840eaba/data';
    const config = {
        headers: {
            Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const requestData = {
        limit: 100,
        fields: [
            '_widget_1631987332358'
        ],
        filter: {
            rel: 'and',
            cond: [
                {
                    field: '_widget_1631987333251',
                    method: 'in',
                    value: ['丰岛东京', '丰岛名古屋'],
                },
            ],
        },
    };

    if (dataId) {
        requestData.data_id = dataId;
    }

    try {
        const response = await axios.post(url, requestData, config);
        const responseData = response.data;

        // 处理获取到的数据
        responseData.data.forEach(async item => {
            clientName.push(item._widget_1631987332358);

            await writeLogToFile("客户名：" + item._widget_1631987332358);
        });

        if (responseData.data.length === 100) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(fetchData(responseData.data[responseData.data.length - 1]._id));
                }, 40);
            });
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

const Data = [];
async function dataFiltering(dataId) {
    const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/61ad62ee5faa0e000829075d/data';
    const config = {
        headers: {
            Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const requestData = {
        limit: 100,
        fields: [
            '_widget_1638753006899',
            '_widget_1638753006849',
            '_widget_1638753006870',
            '_widget_1638753008475',
            '_widget_1638755556920'
        ],
        filter: {
            rel: 'and',
            cond: [
                {
                    field: '_widget_1638753006794',
                    method: 'in',
                    value: clientName,
                },
                {
                    field: '_widget_1638755556920',
                    method: 'in',
                    value: ['初次', '一次修正', '二次修正']
                }
            ],
        },
    };

    if (dataId) {
        requestData.data_id = dataId;
    }

    try {
        const response = await axios.post(url, requestData, config);
        const responseData = response.data;

        // 处理获取到的数据
        responseData.data.forEach(async item => {
            Data.push(item);

            await writeLogToFile("获取数据：" + JSON.stringify(item));
        });

        if (responseData.data.length === 100) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(dataFiltering(responseData.data[responseData.data.length - 1]._id));
                }, 40);
            });
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function dataScreening() {
    const del = [];
    const taskLisk = {
        "二次修正": 2,
        "一次修正": 1,
        "初次": 0
    }

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if (Data[i]._widget_1638753006849 === Data[j]._widget_1638753006849) {
                if (taskLisk[Data[i]._widget_1638755556920] > taskLisk[Data[j]._widget_1638755556920]) {
                    del.push(j);
                } else if (taskLisk[Data[i]._widget_1638755556920] < taskLisk[Data[j]._widget_1638755556920]) {
                    del.push(i);
                }
            }
        }
    }

    function quickSort(arr) {
        if (arr.length <= 1) {
            return arr;
        }

        const pivot = arr[Math.floor(arr.length / 2)];
        const left = [];
        const right = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > pivot) {
                left.push(arr[i]);
            } else if (arr[i] < pivot) {
                right.push(arr[i]);
            }
        }

        return [...quickSort(left), pivot, ...quickSort(right)];
    }
    const shortDel = quickSort(del);

    for (const i of shortDel) {
        Data.splice(i, 1);
    }
}

async function DataTo_csvData() {
    const csvData = [];

    async function To_csv(item) {
        if (item._widget_1638755556920 === "初次") {
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B101", item._widget_1638753008475]);
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B102", item._widget_1638753006870]);
        } else if (item._widget_1638755556920 === "一次修正") {
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B201", item._widget_1638753008475]);
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B202", item._widget_1638753006870]);
        } else if (item._widget_1638755556920 === "二次修正") {
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B301", item._widget_1638753008475]);
            csvData.push([item._widget_1638753006849, item._widget_1638753006899, "B302", item._widget_1638753006870]);
        }
    }

    for (const item of Data) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(To_csv(item));
            }, 40);
        });
    }

    return csvData;
}

async function start() {
    await logTime();
    writeLogToFile("---开始获取数据并处理。---");
    writeLogToFile(formatter.format(new Date()));

    await screenClientContacts();
    await dataFiltering();
    await dataScreening();

    writeLogToFile("---本次查询结束。---");
    writeLogToFile(formatter.format(new Date()));

    return writeCSVToFile(await DataTo_csvData());
}

module.exports = { start };