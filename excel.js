const XlsxPopulate = require('xlsx-populate');

// 创建一个新的工作簿
XlsxPopulate.fromBlankAsync()
    .then(workbook => {
        const sheet = workbook.sheet(0);

        // 在A1单元格中写入数据
        sheet.cell('A1').value('Hello');
        // 在B1单元格中写入数据
        sheet.cell('B1').value('World');

        // 保存工作簿为Excel文件
        return workbook.toFileAsync('./output.xlsx');
    })
    .then(() => {
        console.log('Excel文件已生成');
    })
    .catch(err => {
        console.error('生成Excel文件时出错:', err);
    });
