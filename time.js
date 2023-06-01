const now = new Date();

// 获取年份、月份和日期
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1，并补零
const day = String(now.getDate()).padStart(2, '0'); // 补零

// 获取小时、分钟和秒钟
const hours = String(now.getHours()).padStart(2, '0'); // 补零
const minutes = String(now.getMinutes()).padStart(2, '0'); // 补零
const seconds = String(now.getSeconds()).padStart(2, '0'); // 补零

// 拼接年月日和时分秒
const date = `${year}${month}${day}`;
const time = `${hours}${minutes}${seconds}`;

console.log(`当前日期：${date}`);
console.log(`当前时间：${time}`);
