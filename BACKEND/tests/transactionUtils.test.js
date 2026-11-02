const test = require('node:test');
const assert = require('node:assert/strict');
const {
    buildTransactionFilter,
    validateTransactionInput,
} = require('../utils/transactionUtils');

test('builds a safely escaped search and date/category filter with pagination', () => {
    const result = buildTransactionFilter({
        search: 'food.*',
        category: 'Food',
        from: '2026-01-01',
        to: '2026-01-31',
        page: '2',
        limit: '20',
    }, 'category');

    assert.equal(result.page, 2);
    assert.equal(result.limit, 20);
    assert.equal(result.filter.category, 'Food');
    assert.equal(result.filter.date.$gte.toISOString(), '2025-12-31T18:30:00.000Z');
    assert.equal(result.filter.date.$lte.toISOString(), '2026-01-31T18:29:59.999Z');
    assert.equal(result.filter.$or[0].category.source, 'food\\.\\*');
});

test('rejects invalid date ranges and pagination', () => {
    assert.throws(
        () => buildTransactionFilter({ from: '2026-02-01', to: '2026-01-01' }, 'category'),
        { statusCode: 400 }
    );
    assert.throws(
        () => buildTransactionFilter({ page: 0 }, 'category'),
        { statusCode: 400 }
    );
    assert.throws(
        () => buildTransactionFilter({ from: '2026-02-30' }, 'category'),
        { statusCode: 400 }
    );
});

test('validates transaction details and normalizes tags', () => {
    const transaction = validateTransactionInput({
        category: '  Food ',
        amount: '180.50',
        date: '2026-01-01T10:00:00.000Z',
        note: ' lunch ',
        tags: [' work ', 'work', 'meal'],
    }, 'category');

    assert.equal(transaction.category, 'Food');
    assert.equal(transaction.amount, 180.5);
    assert.equal(transaction.note, 'lunch');
    assert.deepEqual(transaction.tags, ['work', 'meal']);
});

test('rejects non-positive amounts and malformed transaction values', () => {
    assert.throws(
        () => validateTransactionInput({
            category: 'Food',
            amount: 0,
            date: '2026-01-01',
        }, 'category'),
        { statusCode: 400 }
    );
    assert.throws(
        () => validateTransactionInput({
            category: 'Food',
            amount: 12,
            date: 'not-a-date',
        }, 'category'),
        { statusCode: 400 }
    );
    assert.throws(
        () => validateTransactionInput({
            category: 'Food',
            amount: 12,
            date: '2026-02-30T12:00:00+05:30',
        }, 'category'),
        { statusCode: 400 }
    );
});
