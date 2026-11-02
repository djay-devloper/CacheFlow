const Income = require('../models/Income');
const Expense = require('../models/Expense');

const monthKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`;
const INDIA_OFFSET_MS = 330 * 60 * 1000;

const getReportWindow = (now) => {
    const indiaNow = new Date(now.getTime() + INDIA_OFFSET_MS);
    const firstMonth = new Date(Date.UTC(indiaNow.getUTCFullYear(), indiaNow.getUTCMonth() - 11, 1));
    const startDate = new Date(firstMonth.getTime() - INDIA_OFFSET_MS);
    return {
        firstMonth,
        startDate,
        from: firstMonth.toISOString().slice(0, 10),
        to: indiaNow.toISOString().slice(0, 10),
    };
};

const buildFinanceReport = (incomeRows, expenseRows, categoryRows, now = new Date(), monthlyCategoryRows = []) => {
    const { firstMonth, from, to } = getReportWindow(now);
    const monthly = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1));
        const key = monthKey(date.getUTCFullYear(), date.getUTCMonth() + 1);
        return {
            month: key,
            label: date.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
            income: 0,
            expenses: 0,
            net: 0,
        };
    });

    const monthIndex = new Map(monthly.map((row, index) => [row.month, index]));
    for (const row of incomeRows) {
        const index = monthIndex.get(monthKey(row._id.year, row._id.month));
        if (index !== undefined) monthly[index].income = row.total;
    }
    for (const row of expenseRows) {
        const index = monthIndex.get(monthKey(row._id.year, row._id.month));
        if (index !== undefined) monthly[index].expenses = row.total;
    }
    monthly.forEach((row) => {
        row.net = Number((row.income - row.expenses).toFixed(2));
    });

    const totalIncome = monthly.reduce((total, row) => total + row.income, 0);
    const totalExpenses = monthly.reduce((total, row) => total + row.expenses, 0);
    return {
        coverage: {
            from,
            to,
        },
        totals: {
            income: Number(totalIncome.toFixed(2)),
            expenses: Number(totalExpenses.toFixed(2)),
            net: Number((totalIncome - totalExpenses).toFixed(2)),
        },
        monthly,
        categories: categoryRows.map((row) => ({
            category: row._id || 'Uncategorized',
            total: Number(row.total.toFixed(2)),
        })),
        monthlyCategories: monthlyCategoryRows.map((row) => ({
            month: monthKey(row._id.year, row._id.month),
            categories: row.categories.map((category) => ({
                category: category.category || 'Uncategorized',
                total: Number(category.total.toFixed(2)),
            })),
        })),
    };
};

const getFinanceReport = async (userId, now = new Date()) => {
    const { startDate } = getReportWindow(now);
    const match = { userId, date: { $gte: startDate, $lte: now } };
    const groupByMonth = {
        year: { $year: { date: '$date', timezone: 'Asia/Kolkata' } },
        month: { $month: { date: '$date', timezone: 'Asia/Kolkata' } },
    };
    const [incomeRows, expenseRows, categoryRows, monthlyCategoryRows] = await Promise.all([
        Income.aggregate([
            { $match: match },
            { $group: { _id: groupByMonth, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
            { $match: match },
            { $group: { _id: groupByMonth, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
            { $match: match },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]),
        Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        year: { $year: { date: '$date', timezone: 'Asia/Kolkata' } },
                        month: { $month: { date: '$date', timezone: 'Asia/Kolkata' } },
                        category: '$category',
                    },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1, total: -1 } },
            {
                $group: {
                    _id: { year: '$_id.year', month: '$_id.month' },
                    categories: { $push: { category: '$_id.category', total: '$total' } },
                },
            },
            { $project: { categories: { $slice: ['$categories', 10] } } },
        ]),
    ]);

    return buildFinanceReport(incomeRows, expenseRows, categoryRows, now, monthlyCategoryRows);
};

module.exports = { buildFinanceReport, getFinanceReport };
