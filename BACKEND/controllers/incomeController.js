const Income = require('../models/Income');
const createTransactionController = require('./transactionControllerFactory');

module.exports = createTransactionController({
    Model: Income,
    displayField: 'source',
    label: 'income',
});
