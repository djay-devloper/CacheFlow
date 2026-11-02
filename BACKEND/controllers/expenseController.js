const Expense = require('../models/Expense');
const createTransactionController = require('./transactionControllerFactory');

module.exports = createTransactionController({
    Model: Expense,
    displayField: 'category',
    label: 'expense',
});
