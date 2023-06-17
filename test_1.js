const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');

async function checkTheArrivalTimeOfFabric(orderNumberArray) {

    const screened_orderNumberArray = [];
    const Data = [];
    const csvData = [];

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
                console.log(response.data.data[0]._widget_1648175379567);
                screened_orderNumberArray.push(response.data.data[0]._widget_1648175379567);
                // writeLogToFile("过滤后的订单号: " + response.data.data[0]._widget_1648175379567);
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

    for (const orderNumber of screened_orderNumberArray) {
        for (const data of Data) {
            const widgetValue = data[0]._widget_1662619824039;
            if (widgetValue && widgetValue.includes(orderNumber)) {
                const value = data[1]._widget_1648650452636;
                for (const Code of ['A101', 'A121', 'A122', 'A123']) {
                    csvData.push([orderNumber, Code, value]);
                }
                continue;
            }
        }
    }

    return csvData;
}

(async () => {

    const array = ["FO23103409", "YTM0495", "YTM0496", "qqqqqq"];

    console.log(await checkTheArrivalTimeOfFabric(array));
})();