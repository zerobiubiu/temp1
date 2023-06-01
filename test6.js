const Client = require('ssh2-sftp-client');
const fs = require('fs');
// const csv = require('csv-parser');
const csv = require('fast-csv');
const axios = require('axios');

const sftp = new Client();

// SFTP连接配置
// const config = {
//     host: '119.23.139.51',
//     port: '22',
//     username: 'S59353018',
//     // username: 'root',
//     password: '88123456'
//     // password: 'TGp6sJ7rKm'
// };
const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    // username: 'root',
    password: '1122'
    // password: 'TGp6sJ7rKm'
};

// 监听的远程目录路径
const remoteDirPath = './send/';
const localDirPath = './client_file/'

// 用于存储已检测到的文件列表
let fileCache = [];

function convertToUTCDate(dateStr) {
    const date = new Date(dateStr);
    date.setUTCHours(date.getUTCHours() + 8);
    const formattedDate = date.toISOString();
    return formattedDate;
}

function ID_SSD_Deal(Path) {
    const results = []; // 存储处理后的数据

    fs.createReadStream(Path)
        .pipe(csv.parse({ headers: false }))
        .on('data', (data) => {
            // 处理每一行数据
            results.push(data);
        })
        .on('end', () => {
            // CSV文件解析完成
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

}

// 定期检查目录变动
function checkDirectoryChanges() {
    sftp.list(remoteDirPath)
        .then(files => {
            // 检查新增文件
            files.forEach(file => {
                if (!fileCache.includes(file.name)) {
                    fileCache.push(file.name);
                    sftp.get(remoteDirPath + file.name, localDirPath + file.name);
                    const lastIndex = file.name.lastIndexOf('_');
                    if (lastIndex !== -1) {
                        const data_interface = file.name.substring(0, lastIndex);
                        console.log(data_interface);
                        switch (data_interface) {
                            case 'IM_ISP':
                                break;
                            case 'IM_KOJYO':
                                break;
                            case 'ID_SMP':
                                break;
                            case 'ID_SSD':
                                ID_SSD_Deal(localDirPath + file.name);
                                break;
                            case 'ID_SSDM':

                                break;
                            case 'ID_SSD_KOJYO':
                                break;
                            case 'ID_SSD_ISP':
                                break;
                            case 'ID_SMP_CMT':
                                break;
                            case 'ID_SMPPROG_YOT':
                                break;
                            case 'ID_SSDPROG_YOT':
                                break;
                            default:
                                break;
                        }
                    }
                }
            });

            // 检查删除文件
            fileCache.forEach(file => {
                if (!files.find(f => f.name === file)) {
                    fileCache = fileCache.filter(f => f !== file);
                    console.log('删除文件:', file);
                }
            });
        })
        .catch(err => {
            console.error('无法获取远程目录列表:', err);
        });
}

// 连接到SFTP服务器
sftp.connect(config)
    .then(() => {
        // 执行一次目录变动检查
        checkDirectoryChanges();

        // 开始定期检查目录变动
        setInterval(checkDirectoryChanges, 5000); // 5秒钟检查一次
    })
    .catch(err => {
        console.error('连接SFTP服务器失败:', err);
    });
