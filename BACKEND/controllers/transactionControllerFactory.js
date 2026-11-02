const fs = require('fs/promises');
const path = require('path');
const xlsx = require('xlsx');
const { Types } = require('mongoose');
const {
    buildTransactionFilter,
    validateTransactionInput,
} = require('../utils/transactionUtils');

const RECEIPT_DIR = path.join(__dirname, '../private-receipts');

const removeReceipt = async (filename) => {
    if (!filename) return;
    try {
        await fs.unlink(path.join(RECEIPT_DIR, filename));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Failed to remove transaction receipt:', error);
        }
    }
};

const createTransactionController = ({ Model, displayField, label }) => ({
    add: async (req, res) => {
        try {
            const values = validateTransactionInput(req.body, displayField);
            const transaction = await Model.create({ ...values, userId: req.user._id });
            res.status(201).json({ message: `${label} added successfully`, [label]: transaction });
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({ message: error.message });
            }
            console.error(`Error adding ${label}:`, error);
            res.status(500).json({ message: `Could not add ${label}` });
        }
    },

    getAll: async (req, res) => {
        try {
            const { filter, page, limit } = buildTransactionFilter(req.query, displayField);
            filter.userId = req.user._id;
            const [transactions, total, summary] = await Promise.all([
                Model.find(filter)
                    .sort({ date: -1, _id: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                Model.countDocuments(filter),
                Model.aggregate([
                    { $match: filter },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ]),
            ]);

            res.status(200).json({
                [label === 'income' ? 'incomes' : 'expenses']: transactions,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
                summary: { total: summary[0]?.total || 0 },
            });
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({ message: error.message });
            }
            console.error(`Error fetching ${label}:`, error);
            res.status(500).json({ message: `Could not fetch ${label}` });
        }
    },

    update: async (req, res) => {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Transaction ID is invalid' });
        }

        try {
            const values = validateTransactionInput(req.body, displayField, { partial: true });
            if (!Object.keys(values).length) {
                return res.status(400).json({ message: 'Provide at least one field to update' });
            }

            const transaction = await Model.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { $set: values },
                { new: true, runValidators: true }
            );

            if (!transaction) {
                return res.status(404).json({ message: `${label} not found` });
            }
            res.status(200).json({ message: `${label} updated successfully`, [label]: transaction });
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({ message: error.message });
            }
            console.error(`Error updating ${label}:`, error);
            res.status(500).json({ message: `Could not update ${label}` });
        }
    },

    delete: async (req, res) => {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Transaction ID is invalid' });
        }

        try {
            const transaction = await Model.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!transaction) {
                return res.status(404).json({ message: `${label} not found` });
            }
            await removeReceipt(transaction.receipt?.filename);
            res.status(200).json({ message: `${label} deleted successfully` });
        } catch (error) {
            console.error(`Error deleting ${label}:`, error);
            res.status(500).json({ message: `Could not delete ${label}` });
        }
    },

    downloadExcel: async (req, res) => {
        try {
            const { filter } = buildTransactionFilter({ ...req.query, page: 1, limit: 100 }, displayField);
            filter.userId = req.user._id;
            const transactions = await Model.find(filter).sort({ date: -1, _id: -1 });
            const rows = transactions.map((transaction) => ({
                [displayField === 'source' ? 'Source' : 'Category']: transaction[displayField],
                Amount: transaction.amount,
                Date: new Date(transaction.date).toISOString(),
                Note: transaction.note || '',
                Tags: (transaction.tags || []).join(', '),
            }));
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(rows);
            xlsx.utils.book_append_sheet(workbook, worksheet, label);
            const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', `attachment; filename=${label}_report.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Length', buffer.length);
            res.end(buffer);
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({ message: error.message });
            }
            console.error(`Error downloading ${label} report:`, error);
            res.status(500).json({ message: `Could not download ${label} report` });
        }
    },

    uploadReceipt: async (req, res) => {
        if (!Types.ObjectId.isValid(req.params.id)) {
            await removeReceipt(req.file?.filename);
            return res.status(400).json({ message: 'Transaction ID is invalid' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Choose a receipt file to upload' });
        }

        try {
            const transaction = await Model.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!transaction) {
                await removeReceipt(req.file.filename);
                return res.status(404).json({ message: `${label} not found` });
            }

            const previousReceipt = transaction.receipt?.filename;
            transaction.receipt = {
                filename: req.file.filename,
                originalName: path.basename(req.file.originalname).slice(0, 120),
                contentType: req.file.mimetype,
                uploadedAt: new Date(),
            };
            await transaction.save();
            await removeReceipt(previousReceipt);
            res.status(200).json({ message: 'Receipt uploaded successfully', receipt: transaction.receipt });
        } catch (error) {
            await removeReceipt(req.file.filename);
            console.error(`Error uploading ${label} receipt:`, error);
            res.status(500).json({ message: 'Could not upload receipt' });
        }
    },

    downloadReceipt: async (req, res) => {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Transaction ID is invalid' });
        }

        try {
            const transaction = await Model.findOne({
                _id: req.params.id,
                userId: req.user._id,
            }).select('receipt');
            if (!transaction?.receipt?.filename) {
                return res.status(404).json({ message: 'Receipt not found' });
            }

            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.download(
                path.join(RECEIPT_DIR, transaction.receipt.filename),
                transaction.receipt.originalName,
                { headers: { 'Content-Type': transaction.receipt.contentType } },
                (error) => {
                    if (error && !res.headersSent) {
                        if (error.code === 'ENOENT') {
                            res.status(404).json({ message: 'Receipt file is no longer available' });
                        } else {
                            console.error('Error downloading transaction receipt:', error);
                            res.status(500).json({ message: 'Could not download receipt' });
                        }
                    }
                }
            );
        } catch (error) {
            console.error(`Error fetching ${label} receipt:`, error);
            res.status(500).json({ message: 'Could not fetch receipt' });
        }
    },
});

module.exports = createTransactionController;
