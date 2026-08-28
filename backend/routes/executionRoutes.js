const express = require('express');
const router = express.Router();
const { runCode } = require('../controllers/executionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', runCode);

module.exports = router;
