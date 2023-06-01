const Client = require('ssh2-sftp-client');
const axios = require('axios');

const sftp = new Client();

const config = {
    host: '120.27.20.169',
    port: '22',
    username: 'sftp',
    password: '1122'
};

const remoteDirPath = './receive/';

setInterval(checkDirectoryChanges, 5000);


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