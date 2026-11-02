const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { askCopilot } = require('../controllers/copilotController');

const router = express.Router();

router.post('/ask', protect, askCopilot);

module.exports = router;
