// const axios = require('axios');

// const postData = {
//     "data": {
//         "_widget_1685584989914": {
//             "value": "张三"
//         },
//         "_widget_1685584989915": {
//             "value": "2018-01-01T10:10:10.000Z"
//         },
//         "_widget_1685584989916": {
//             "value": "女"
//         },
//         "_widget_1685584989918": {
//             "value": "张三"
//         },
//         "_widget_1685584989919": {
//             "value": 10
//         },
//         "_widget_1685584989920": {
//             "value": "女"
//         },
//         "_widget_1685584989921": {
//             "value": "女"
//         },
//         "_widget_1685584989926": {
//             "value": "女"
//         },
//         "_widget_1685584989928": {
//             "value": "女"
//         },
//         "_widget_1685584989930": {
//             "value": "2018-01-01T10:10:10.000Z"
//         }
//     },
//     "is_start_workflow": true,
//     "is_start_trigger": true
// };
// const url = "https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/6477fc5d266775000815b118/data_create";

// axios.post(url, postData)
//     .then((response) => {
//         console.log('响应数据:', response.data);
//     })
//     .catch((error) => {
//         console.error('请求发生错误:', error);
//     });


// var axios = require('axios');
// var data = JSON.stringify({
//     "data": {
//         "_widget_1685584989914": {
//             "value": "张三"
//         },
//         "_widget_1685584989915": {
//             "value": "2018-01-01T10:10:10.000Z"
//         },
//         "_widget_1685584989916": {
//             "value": "女"
//         },
//         "_widget_1685584989918": {
//             "value": "张三"
//         },
//         "_widget_1685584989919": {
//             "value": 10
//         },
//         "_widget_1685584989920": {
//             "value": "女"
//         },
//         "_widget_1685584989921": {
//             "value": "女"
//         },
//         "_widget_1685584989926": {
//             "value": "女"
//         },
//         "_widget_1685584989928": {
//             "value": "女"
//         },
//         "_widget_1685584989930": {
//             "value": "2018-01-01T10:10:10.000Z"
//         }
//     },
//     "is_start_workflow": true,
//     "is_start_trigger": true
// });

// var config = {
//     method: 'post',
//     url: 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/6477fc5d266775000815b118/data_create',
//     headers: {
//         'Authorization': 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
//         'Content-Type': 'application/json',
//         'Accept': '*/*',
//         'Host': 'api.jiandaoyun.com',
//         'Connection': 'keep-alive'
//     },
//     data: data
// };

// axios(config)
//     .then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


const axios = require('axios');

const data = {
    data: {
        _widget_1685584989914: { value: '张三' },
        _widget_1685584989915: { value: '2018-01-01T10:10:10.000Z' },
        _widget_1685584989916: { value: '女' },
        _widget_1685584989918: { value: '张三' },
        _widget_1685584989919: { value: 10 },
        _widget_1685584989920: { value: '女' },
        _widget_1685584989921: { value: '女' },
        _widget_1685584989926: { value: '女' },
        _widget_1685584989928: { value: '女' },
        _widget_1685584989930: { value: '2018-01-01T10:10:10.000Z' }
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