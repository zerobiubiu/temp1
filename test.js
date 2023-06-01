const axios = require('axios');

const jsonData = {
    '202300000100002-1': [
        ['002', 'S', '绿色', '60'],
        ['002', 'M', '绿色', '70'],
        ['003', 'L', '黄色', '70']
    ]
};





const keys = Object.keys(jsonData);
const firstKey = keys[0];


function fff(jsonData) {
    var zhi = [];
    for (const key in jsonData) {
        const rows = jsonData[key];
        rows.forEach((line) => {
            // 在这里处理每行的数据
            // console.log(row);
            zhi.push({
                _widget_1685598573915: { value: line[0] + line[2] },
                _widget_1685598573916: { value: line[1] },
                _widget_1685598573917: { value: line[3] }
            })
        });
    }
    return zhi;
}

const data = {
    data: {
        _widget_1685598573914: { value: firstKey },
        _widget_1685598573912: {
            value: fff(jsonData)
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

