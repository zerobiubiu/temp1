const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');

module.exports = { work, startAccessory, startSendSample, startFabricArrival };

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
    const filename = `OD_SSDPROG_YOT_${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}${new Date().getSeconds().toString().padStart(2, '0')}.csv`;
    const fileDirPath = localDirPath + filename;

    let csvContent = '';
    for (const row of csvData) {
        const date = new Date(row[row.length - 1]);
        const formattedDate = `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        row[row.length - 1] = formattedDate;
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

// 返回符合条件的订单号
async function order_attribution_inquiry() {

    const order_number = [];
    async function fetchData(dataId) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/619ccfa6209a2e0008c75bc4/data';
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
                '_widget_1634804601451',
                '_widget_1630838812092',
                '_widget_1630838811229'
            ],
            filter: {
                rel: 'and',
                cond: [
                    {
                        field: '_widget_1634804601451',
                        method: 'eq',
                        value: '已下计划',
                    },
                    {
                        field: '_widget_1630838812092',
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
                // const id = item._id;
                // idArray.push(id);

                // writeLogToFile("符合的data_id: " + id);
                order_number.push(item._widget_1630838811229);
                writeLogToFile("符合的订单号: " + item._widget_1630838811229);

            });

            if (responseData.data.length === 100) {
                const lastItem = responseData.data[responseData.data.length - 1];
                const newDataId = lastItem._id;

                await fetchData(newDataId);
            } else {
                return;
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }
    await fetchData(null);

    return order_number;
}


// ====================== 工序时间 ========================

async function startWork() {// 任务列表
    const taskList = [
        { "_widget_1646226395797": "A311" },
        { "_widget_1646226395809": "A312" },
        { "_widget_1646226774441": "A341" },
        { "_widget_1646226774454": "A342" },
        { "_widget_1646226774552": "A351" },
        { "_widget_1646226774625": "A352" },
        { "_widget_1646226774625": "A353" },
        { "_widget_1646226774762": "A361" }
    ];

    // 获取当前时间戳作为日志文件名
    const year = new Date().getFullYear().toString().padStart(4, '0');
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const seconds = new Date().getSeconds().toString().padStart(2, '0');
    const timestamp = `${year}.${month}.${day}_${hours}${minutes}${seconds}`;
    const filename = `OD_SSDPROG_YOT${timestamp}.log`;

    // 日志文件路径
    const localDirPath = './logs/';
    const fileDirPath = localDirPath + filename;
    console.log("生成日志文件：" + fileDirPath);

    // 日期格式化选项
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
    const formatter = new Intl.DateTimeFormat('zh-CN', options);

    // 存储获取到的数据ID
    const idArray = [];
    const filtered_idArray = [];
    const csvData = [];

    // 发送第三个请求并处理返回值的函数
    async function fetchTaskDuration(task, id) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/621f6bcacf9efd0007ba797f/data_retrieve';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
        const requestData = {
            data_id: id,
        };

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data.data;
            // 将请求的数据存入csvData数组中
            csvData.push([responseData['_widget_1647850075329'], Object.values(task)[0], responseData[Object.keys(task)[0]]]);
            // 将请求的数据写入日志文件
            writeLogToFile("请求款号：" + responseData['_widget_1647850075329'] + "  请求项目：" + Object.values(task)[0] + "  获取时间：" + responseData[Object.keys(task)[0]]);
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 发送第二个请求并处理返回值的函数
    async function fetchWorkflowInstance(instanceId) {
        const url = 'https://api.jiandaoyun.com/api/v3/workflow/instance/get';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const requestData = {
            instance_id: instanceId,
        };

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data;

            if (responseData.tasks.length === 0) {
                const id = responseData.instance_id;
                filtered_idArray.push(id);
                // 将筛选后的数据ID写入日志文件
                writeLogToFile("筛选后的 ID：" + id);
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 发送请求获取数据的函数
    async function fetchData(dataId) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/621f6bcacf9efd0007ba797f/data';
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
                '_widget_1646232829480',
                '_widget_1649662308032',
            ],
            filter: {
                rel: 'and',
                cond: [
                    {
                        field: '_widget_1646232829480',
                        method: 'eq',
                        value: '在产',
                    },
                    {
                        field: '_widget_1649662308032',
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
                const id = item._id;
                idArray.push(id);
                // 将初始获取的数据ID写入日志文件
                await writeLogToFile("第一次请求初始 ID：" + id);
            });

            if (responseData.data.length === 100) {
                const lastItem = responseData.data[responseData.data.length - 1];
                const newDataId = lastItem._id;

                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(fetchData(newDataId));
                    }, 40);
                });
            } else {
                // 第一次请求完毕后开始执行第二次请求
                writeLogToFile("---第一次请求完毕。---");
                writeLogToFile("---开始执行第二次请求。---");

                for (const item of idArray) {
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(fetchWorkflowInstance(item));
                        }, 40);
                    });
                }

                writeLogToFile("---第二次请求完成。---");
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 将数据写入CSV文件的函数
    function writeCSVToFile() {
        function padZero(num) {
            return num.toString().padStart(2, '0');
        }
        const localDirPath = "./output/";
        const filename = `OD_SSDPROG_YOT_${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}${new Date().getSeconds().toString().padStart(2, '0')}.csv`;
        const fileDirPath = localDirPath + filename;

        let csvContent = '';
        for (const row of csvData) {
            const date = new Date(row[row.length - 1]);
            const formattedDate = `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
            row[row.length - 1] = formattedDate;
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

    // 将日志写入文件的函数
    async function writeLogToFile(log) {
        try {
            await fs.promises.appendFile(fileDirPath, log + '\n');
        } catch (err) {
            console.error('写入日志文件时发生错误:', err);
        }
    }

    // 获取数据并打印到CSV文件的函数
    async function OD_SSDPROG_fetchDataAndPrint() {
        await fetchData(null);

        writeLogToFile("---执行第三次请求。---");
        for (const item of filtered_idArray) {
            for (const task of taskList) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(fetchTaskDuration(task, item));
                    }, 40);
                });
            }
        }
        writeLogToFile("---第三次请求已完成。---");

        return await writeCSVToFile();
    }

    // 主函数
    async function main() {
        try {
            fs.mkdirSync(localDirPath, { recursive: true });
        } catch (error) {
            console.error('创建日志目录时发生错误:', error);
            return;
        }
        // 开始获取数据并处理
        writeLogToFile("---开始获取数据并处理。---");
        writeLogToFile(formatter.format(new Date()));
        const filename = await OD_SSDPROG_fetchDataAndPrint();
        writeLogToFile("---本次查询结束。---");
        writeLogToFile(formatter.format(new Date()));
        return filename;
    }

    return main();
}

async function work() {
    const filename = await startWork();
    return filename;
}

// ====================== 辅料时间 ========================


// 筛选辅料采购日
async function queryExpectedDateOfExcipients(orderNumberArray) {

    const idArray = [];
    const screened_idArray = [];
    const csvData = [];

    const taskList = [
        { "_widget_1633433137942": "A201" },
        { "_widget_1633433138125": "A202" }
    ];

    // 筛选订单号并推送 data_id 到 idArray
    async function orderNumberTo_data_id(orderNumber) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/615c362331aa2100090f2698/data';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const requestData = {
            limit: 1,
            fields: [
                '_widget_1632637113760'
            ],
            filter: {
                rel: 'and',
                cond: [
                    {
                        field: '_widget_1632637113760',
                        method: 'eq',
                        value: orderNumber,
                    }
                ],
            },
        };

        try {
            const response = await axios.post(url, requestData, config);

            idArray.push(response.data.data[0]._id);

            writeLogToFile("订单号转换 data_id: " + response.data.data[0]._id);
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 逐条取出 orderNumberArray 调用 orderNumberTo_data_id()
    for (const id of orderNumberArray) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(orderNumberTo_data_id(id));
            }, 40);
        });
    }

    // 筛选流程结束后的 data_id 推送到 screened_idArray
    async function dataScreening(instanceId) {
        const url = 'https://api.jiandaoyun.com/api/v3/workflow/instance/get';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const requestData = {
            instance_id: instanceId,
        };

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data;

            if (responseData.tasks.length === 0) {
                screened_idArray.push(instanceId);

                writeLogToFile("筛选符合条件的 data_id:" + instanceId);
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 逐条取出 idArray 调用 dataScreening()
    for (const id of idArray) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(dataScreening(id));
            }, 40);
        });
    }

    // 获取时间,并推送正式格式到 csvData
    async function fetchTaskDuration(task, id) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/615c362331aa2100090f2698/data_retrieve';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
        const requestData = {
            data_id: id,
        };

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data.data;

            csvData.push([responseData['_widget_1647849728187'], Object.values(task)[0], responseData._widget_1632640785036[0][Object.keys(task)[0]]]);
            writeLogToFile("请求款号：" + responseData['_widget_1647849728187'] + "  请求项目：" + Object.values(task)[0] + "  获取时间：" + responseData._widget_1632640785036[0][Object.keys(task)[0]]);
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 逐条取出 screened_idArray 并调用 fetchTaskDuration
    for (const item of screened_idArray) {
        for (const task of taskList) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(fetchTaskDuration(task, item));
                }, 40);
            });
        }
    }

    return csvData;
}

// 启动函数
async function startAccessory() {

    logTime();

    writeLogToFile("---开始获取数据并处理。---");
    writeLogToFile(formatter.format(new Date()));

    const orderNumberArray = await order_attribution_inquiry();
    const csvData = await queryExpectedDateOfExcipients(orderNumberArray);
    const filename = await writeCSVToFile(csvData);

    writeLogToFile("---本次查询结束。---");
    writeLogToFile(formatter.format(new Date()));

    return filename;
}


// ====================== 送样时间 ========================

// 查询样衣预定发送日
async function queryThePresetDeliveryDate(orderNumberArray) {

    const csvData = [];

    const taskList = [
        { "摄影": "A401" },
        { "产前": "A402" },
        { "船样": "A403" }
    ];

    // 获取时间,并推送正式格式到 csvData
    async function fetchTaskDuration(task, orderNumber) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/62232c96e110450007653d1f/data';
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
                '_widget_1638753006849',
                '_widget_1638755556920'
            ],
            filter: {
                rel: 'and',
                cond: [
                    {
                        field: '_widget_1638753006849',
                        method: 'eq',
                        value: orderNumber,
                    }
                ],
            },
        };

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data.data;
            if (Object.entries(responseData).length !== 0) {
                const filteredData = responseData.filter(obj => obj["_widget_1638755556920"].includes(Object.keys(task)[0]));
                const result = filteredData.map(obj => obj["_id"]);

                if (Object.entries(result).length !== 0) {
                    (async (dataId) => {
                        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/62232c96e110450007653d1f/data_retrieve';
                        const config = {
                            headers: {
                                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                        };
                        const requestData = { data_id: dataId };
                        const response = await axios.post(url, requestData, config);
                        const responseData = response.data.data;
                        csvData.push([responseData['_widget_1638753006849'], Object.values(task)[0], responseData['_widget_1638759349849']]);
                        writeLogToFile("请求款号：" + responseData['_widget_1638753006849'] + "  请求项目：" + Object.values(task)[0] + "  获取时间：" + responseData['_widget_1638759349849']);
                    })(result[0]);
                }
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 逐条取出 screened_idArray 并调用 fetchTaskDuration
    for (const orderNumber of orderNumberArray) {
        for (const task of taskList) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(fetchTaskDuration(task, orderNumber));
                }, 40);
            });
        }
    }

    return csvData;
}

// 启动函数
async function startSendSample() {
    logTime();

    writeLogToFile("---开始获取数据并处理。---");
    writeLogToFile(formatter.format(new Date()));

    const orderNumberArray = await order_attribution_inquiry();
    const csvData = await queryThePresetDeliveryDate(orderNumberArray);
    const filename = await writeCSVToFile(csvData);

    writeLogToFile("---本次查询结束。---");
    writeLogToFile(formatter.format(new Date()));

    return filename;
}


// ====================== 面料时间 ========================

// 查询面料日期
async function checkTheArrivalTimeOfFabric(orderNumberArray) {

    const screened_orderNumberArray = [];
    const Data = [];
    const csvData = [];

    // 过滤未做计划的订单
    async function orderNumberScreened(orderNumber) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/62edc36cf7a1f20008311e6f/data';
        const config = {
            headers: {
                Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const requestData = {
            limit: 1,
            fields: [
                '_widget_1648175379567'
            ],
            filter: {
                rel: 'and',
                cond: [
                    {
                        field: '_widget_1648175379567',
                        method: 'eq',
                        value: orderNumber,
                    }
                ],
            },
        };

        try {
            const response = await axios.post(url, requestData, config);
            if (Object.entries(response.data.data).length !== 0) {
                screened_orderNumberArray.push(response.data.data[0]._widget_1648175379567);
                writeLogToFile("面料试算过的订单号: " + response.data.data[0]._widget_1648175379567);
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    for (const orderNumber of orderNumberArray) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(orderNumberScreened(orderNumber));
            }, 40);
        });
    }

    // 读取全部采购计划
    async function fetchData(dataId) {
        const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/631989b8d2ffb000088b8869/data';
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
                '_widget_1662619824039',
                '_widget_1648650452636',
            ]
        };

        if (dataId) {
            requestData.data_id = dataId;
        }

        try {
            const response = await axios.post(url, requestData, config);
            const responseData = response.data;

            // 处理获取到的数据
            responseData.data.forEach(async item => {
                Data.push([{ _widget_1662619824039: item._widget_1662619824039 }, { _widget_1648650452636: item._widget_1648650452636 }, { data_id: item._id }]);
                writeLogToFile("读取到的数据: " + [JSON.stringify({ _widget_1662619824039: item._widget_1662619824039 }), JSON.stringify({ _widget_1648650452636: item._widget_1648650452636 }), JSON.stringify({ data_id: item._id })]);
            });

            if (responseData.data.length === 100) {
                const lastItem = responseData.data[responseData.data.length - 1];
                const newDataId = lastItem._id;

                await fetchData(newDataId);
            } else {
                return;
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }
    await fetchData();

    // 读取采购计划中的订单时间
    for (const orderNumber of screened_orderNumberArray) {
        for (const data of Data) {
            const widgetValue = data[0]._widget_1662619824039;
            if (widgetValue && widgetValue.includes(orderNumber)) {
                const value = data[1]._widget_1648650452636;
                if (value !== null && value !== undefined && value !== '') {
                    for (const Code of ['A101', 'A121', 'A122', 'A123']) {
                        csvData.push([orderNumber, Code, value]);
                        writeLogToFile("订单号: " + orderNumber + " 项目：" + Code + " 时间：" + value);
                    }
                }
                break;
            }
        }
    }

    return csvData;
}

// 启动
async function startFabricArrival() {
    logTime();

    writeLogToFile("---开始获取数据并处理。---");
    writeLogToFile(formatter.format(new Date()));

    const orderNumberArray = await order_attribution_inquiry();
    const csvData = await checkTheArrivalTimeOfFabric(orderNumberArray);
    const filename = await writeCSVToFile(csvData);

    writeLogToFile("---本次查询结束。---");
    writeLogToFile(formatter.format(new Date()));

    return filename;
}

startFabricArrival();