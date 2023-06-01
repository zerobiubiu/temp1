const Client = require('ssh2-sftp-client');
const fs = require('fs');
const csv = require('csv-parser');

const sftp = new Client();

// SFTP连接配置
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

// 定期检查目录变动
function checkDirectoryChanges() {
    sftp.list(remoteDirPath)
        .then(files => {
            // 检查新增文件
            files.forEach(file => {
                if (!fileCache.includes(file.name)) {
                    fileCache.push(file.name);
                    try {
                        sftp.get(remoteDirPath + file.name, localDirPath + file.name);
                    } catch (error) {
                        console.error('文件下载失败:', error);
                    } finally {
                        sftp.end();
                    }

                    const lastIndex = file.name.lastIndexOf('_');
                    if (lastIndex !== -1) {
                        const data_interface = file.name.substring(0, lastIndex);
                        switch (data_interface) {
                            case 'IM_ISP':
                                break;
                            case 'IM_KOJYO':
                                break;
                            case 'ID_SMP':
                                break;
                            case 'ID_SSD':
                                (Path = localDirPath + file.name) => {
                                    
                                    const results = [];
                                    fs.createReadStream(Path)
                                        .pipe(csv())
                                        .on('data', (data) => {
                                            // 处理每一行数据
                                            results.push(data);
                                        })
                                        .on('end', () => {
                                            // CSV文件解析完成
                                            console.log(results);
                                        });

                                }
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
