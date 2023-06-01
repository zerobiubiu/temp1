function convertToUTCDate(dateStr) {
    const date = new Date(dateStr);
    date.setUTCHours(date.getUTCHours() + 8);
    const formattedDate = date.toISOString();
    return formattedDate;
}

const dateStr = '2023/06/01';
const convertedDate = convertToUTCDate(dateStr);
console.log(convertedDate);
