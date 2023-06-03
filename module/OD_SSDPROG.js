const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');

async function start() {// 任务列表
    const taskList = [
        { "_widget_1646226395797": "裁剪开始时间" },
        { "_widget_1646226395851": "印花开始时间" },
        { "_widget_1646226774330": "绣花开始时间" },
        { "_widget_1646226774441": "缝纫开始时间" },
        { "_widget_1646226774552": "后整开始时间" },
        { "_widget_1646226774762": "送检开始时间" }
    ];

    // 获取当前时间戳作为日志文件名
    const year = new Date().getFullYear().toString().padStart(4, '0');
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const seconds = new Date().getSeconds().toString().padStart(2, '0');
    const timestamp = `${year}.${month}.${day}_${hours}${minutes}${seconds}`;
    const filename = `OD_SSDPROG_${timestamp}.log`;

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
    async function writeCSVToFile() {
        const localDirPath = "./output/";
        // 生成CSV文件名
        const filename = `OD_SSDPROG_${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}${new Date().getSeconds().toString().padStart(2, '0')}.csv`;
        const fileDirPath = localDirPath + filename;
        writeLogToFile("---开始写入文件---");
        // 将文件名和地址写入日志文件
        writeLogToFile("文件名：" + filename + "  文件地址：" + localDirPath);
        const stream = fs.createWriteStream(fileDirPath);
        csv.write(csvData, { headers: false })
            .pipe(stream)
            .on('finish', () => {
                writeLogToFile("---文件写入成功---");
            })
            .on('error', (err) => {
                console.error('写入CSV文件时发生错误：', err);
            });

        return filename;
    }

    // 将日志写入文件的函数
    async function writeLogToFile(log) {
        fs.appendFile(fileDirPath, log + '\n', (err) => {
            if (err) {
                console.error('写入日志文件时发生错误:', err);
            }
        });
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

async function main() {
    const filename = await start();
    return filename;
}

module.exports = main;