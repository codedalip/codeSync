const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  deleteWorkspace
} = require('../controllers/workspaceController');
const { getWorkspaceFiles, createFile } = require('../controllers/fileController');
const { getWorkspaceMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createWorkspace);
router.post('/join', joinWorkspace);
router.get('/', getUserWorkspaces);
router.get('/:id', getWorkspaceById);
router.delete('/:id', deleteWorkspace);

// Nested routes for files and messages inside workspace
router.get('/:workspaceId/files', getWorkspaceFiles);
router.post('/:workspaceId/files', createFile);
router.get('/:workspaceId/messages', getWorkspaceMessages);

module.exports = router;
