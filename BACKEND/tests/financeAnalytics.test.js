const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFinanceReport } = require('../services/financeAnalytics');

test('builds a 12-month cash-flow report with zero-filled months and totals', () => {
    const now = new Date('2026-11-02T12:00:00.000Z');
    const report = buildFinanceReport(
        [{ _id: { year: 2026, month: 11 }, total: 5000 }],
        [
            { _id: { year: 2026, month: 11 }, total: 1200 },
            { _id: { year: 2026, month: 10 }, total: 300 },
        ],
        [{ _id: 'Food', total: 1200 }],
        now,
        [{
            _id: { year: 2026, month: 11 },
            categories: [{ category: 'Food', total: 1200 }],
        }]
    );

    assert.equal(report.monthly.length, 12);
    assert.equal(report.monthly[0].month, '2025-12');
    assert.equal(report.monthly.at(-1).month, '2026-11');
    assert.equal(report.monthly.at(-1).net, 3800);
    assert.equal(report.totals.income, 5000);
    assert.equal(report.totals.expenses, 1500);
    assert.equal(report.totals.net, 3500);
    assert.deepEqual(report.categories, [{ category: 'Food', total: 1200 }]);
    assert.deepEqual(report.monthlyCategories, [{
        month: '2026-11',
        categories: [{ category: 'Food', total: 1200 }],
    }]);
    assert.deepEqual(report.coverage, { from: '2025-12-01', to: '2026-11-02' });
});
