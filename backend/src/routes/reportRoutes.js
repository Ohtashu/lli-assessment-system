const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', reportController.getSummary);

module.exports = router;
