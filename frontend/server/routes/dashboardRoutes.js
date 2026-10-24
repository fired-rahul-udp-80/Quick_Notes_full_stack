const express = require('express');
const router = express.Router();

const { getStudentDashboardStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/dashboard/stats
router.get('/stats', getStudentDashboardStats);

module.exports = router;
