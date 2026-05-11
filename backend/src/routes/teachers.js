const express = require('express');
const { getMyStats } = require('../controllers/teacherController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/me/stats', protect, authorize('teacher'), getMyStats);

module.exports = router;
