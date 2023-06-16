const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');

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
                    console.log(dataId)
                    const url = 'https://api.jiandaoyun.com/api/v4/app/612613ce863d82000717504f/entry/62232c96e110450007653d1f/data_retrieve';
                    const config = {
                        headers: {
                            Authorization: 'Bearer e417xlhe7h99rF9KSCJMEQM6lNeG58mi',
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    };
                    const requestData = { data_id: dataId };
                    console.log(JSON.stringify(requestData))
                    const response = await axios.post(url, requestData, config);
                    const responseData = response.data.data;
                    // csvData.push(responseData['_widget_1638753006849'], Object.values(task)[0], responseData['_widget_1638759349849']);
                    console.log("请求款号：" + responseData['_widget_1638753006849'] + "  请求项目：" + Object.values(task)[0] + "  获取时间：" + responseData['_widget_1638759349849']);
                })(result[0]);
            }
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

fetchTaskDuration({ "船样": "A403" }, "WE23EC0516-1");