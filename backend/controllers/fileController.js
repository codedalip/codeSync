const { fileStore, memberStore } = require('../config/store');

const detectLanguage = (filename) => {
  if (!filename) return 'javascript';
  const parts = filename.split('.');
  if (parts.length === 1) return 'plaintext';
  const ext = parts.pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return 'cpp';
    case 'c':
    case 'h':
      return 'c';
    case 'java':
      return 'java';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

// Verify membership helper
const checkMembership = async (workspaceId, userId) => {
  const membership = await memberStore.findOne({
    workspace: workspaceId,
    user: userId
  });
  return !!membership;
};

// @desc    Get files for workspace
// @route   GET /api/workspaces/:workspaceId/files
const getWorkspaceFiles = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const isMember = await checkMembership(workspaceId, req.user._id);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a workspace member' });
    }

    const files = await fileStore.findWorkspaceFiles(workspaceId);
    return res.json(files);
  } catch (error) {
    console.error('[Get Files Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new file
// @route   POST /api/workspaces/:workspaceId/files
const createFile = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, content } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const isMember = await checkMembership(workspaceId, req.user._id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a workspace member' });
    }

    const existingFile = await fileStore.findOne({ workspace: workspaceId, name: name.trim() });
    if (existingFile) {
      return res.status(400).json({ message: 'File with this name already exists' });
    }

    const language = detectLanguage(name);
    const file = await fileStore.create({
      workspace: workspaceId,
      name: name.trim(),
      language,
      content: content !== undefined ? content : `// ${name.trim()}\n`
    });

    return res.status(201).json(file);
  } catch (error) {
    console.error('[Create File Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update file (rename or content)
// @route   PUT /api/files/:id
const updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { name, content } = req.body;

    const file = await fileStore.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const isMember = await checkMembership(file.workspace, req.user._id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a workspace member' });
    }

    const updateData = {};
    if (name && name !== file.name) {
      const existing = await fileStore.findOne({ workspace: file.workspace, name: name.trim() });
      if (existing && existing._id.toString() !== fileId) {
        return res.status(400).json({ message: 'File with this name already exists' });
      }
      updateData.name = name.trim();
      updateData.language = detectLanguage(updateData.name);
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    const updatedFile = await fileStore.update(fileId, updateData);
    return res.json(updatedFile);
  } catch (error) {
    console.error('[Update File Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await fileStore.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const isMember = await checkMembership(file.workspace, req.user._id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a workspace member' });
    }

    const fileCount = await fileStore.count(file.workspace);
    if (fileCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the only remaining file in workspace' });
    }

    await fileStore.delete(fileId);
    return res.json({ message: 'File deleted successfully', fileId });
  } catch (error) {
    console.error('[Delete File Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getWorkspaceFiles,
  createFile,
  updateFile,
  deleteFile
};
