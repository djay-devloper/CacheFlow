const express = require('express');

const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const receiptUpload = require('../middleware/receiptUploadMiddleware');

const router = express.Router();

const uploadReceipt = (req, res, next) => {
    receiptUpload.single('receipt')(req, res, (error) => {
        if (!error) return next();
        const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({ message: error.message });
    });
};

router.post('/add', protect, expenseController.add);
router.get('/get', protect, expenseController.getAll);
router.get('/all', protect, expenseController.getAll);
router.get('/download-excel', protect, expenseController.downloadExcel);
router.post('/:id/receipt', protect, uploadReceipt, expenseController.uploadReceipt);
router.get('/:id/receipt', protect, expenseController.downloadReceipt);
router.put('/:id', protect, expenseController.update);
router.delete('/:id', protect, expenseController.delete);

module.exports = router;
