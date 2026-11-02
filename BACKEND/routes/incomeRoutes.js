const express = require('express');

const incomeController = require('../controllers/incomeController');
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

router.post('/add', protect, incomeController.add);
router.get('/get', protect, incomeController.getAll);
router.get('/all', protect, incomeController.getAll);
router.get('/download-excel', protect, incomeController.downloadExcel);
router.post('/:id/receipt', protect, uploadReceipt, incomeController.uploadReceipt);
router.get('/:id/receipt', protect, incomeController.downloadReceipt);
router.put('/:id', protect, incomeController.update);
router.delete('/:id', protect, incomeController.delete);

module.exports = router;
