const express = require('express');
const router = express.Router();
const { updateFile, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/:id', updateFile);
router.delete('/:id', deleteFile);

module.exports = router;
