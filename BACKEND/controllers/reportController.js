const xlsx = require('xlsx');
const { getFinanceReport } = require('../services/financeAnalytics');

exports.getReport = async (req, res) => {
    try {
        res.status(200).json(await getFinanceReport(req.user._id));
    } catch (error) {
        console.error('Error generating finance report:', error);
        res.status(500).json({ message: 'Could not generate finance report' });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const report = await getFinanceReport(req.user._id);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(
            workbook,
            xlsx.utils.json_to_sheet(report.monthly.map((row) => ({
                Month: row.month,
                Income: row.income,
                Expenses: row.expenses,
                'Net cash flow': row.net,
            }))),
            'Monthly cash flow'
        );
        xlsx.utils.book_append_sheet(
            workbook,
            xlsx.utils.json_to_sheet(report.categories.map((row) => ({
                Category: row.category,
                Expenses: row.total,
            }))),
            'Spending by category'
        );
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Disposition', 'attachment; filename=finance_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);
    } catch (error) {
        console.error('Error downloading finance report:', error);
        res.status(500).json({ message: 'Could not download finance report' });
    }
};
