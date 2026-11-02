const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getReport, downloadReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/', protect, getReport);
router.get('/download-excel', protect, downloadReport);

module.exports = router;
