const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const apiLimiter = require('../middleware/rateLimit');

// Homepage Endpoint
router.get('/', downloadController.home);

// Download API Endpoint (Rate Limited)
router.get('/api/download', apiLimiter, downloadController.downloadVideo);

// Stats API Endpoint
router.get('/api/stats', downloadController.getStatsEndpoint);

module.exports = router;
