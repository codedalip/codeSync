const crypto = require('crypto');
const { workspaceStore, memberStore, fileStore } = require('../config/store');

const generateWorkspaceCode = () => {
  return 'CS-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Create new workspace
// @route   POST /api/workspaces
const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    let code = generateWorkspaceCode();
    let existingCode = await workspaceStore.findOne({ code });
    while (existingCode) {
      code = generateWorkspaceCode();
      existingCode = await workspaceStore.findOne({ code });
    }

    const workspace = await workspaceStore.create({
      name,
      description: description || '',
      code,
      owner: req.user._id
    });

    // Add creator as owner member
    await memberStore.create({
      workspace: workspace._id,
      user: req.user._id,
      role: 'owner'
    });

    // Create default starter file
    await fileStore.create({
      workspace: workspace._id,
      name: 'main.js',
      language: 'javascript',
      content: `// Welcome to CodeSync Workspace: ${name}\n// Collaborate in real-time with your team!\n\nfunction greet(name) {\n  console.log("Hello, " + name + "! Welcome to CodeSync.");\n}\n\ngreet("${req.user.name}");\n`
    });

    return res.status(201).json(workspace);
  } catch (error) {
    console.error('[Create Workspace Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Join workspace by join code
// @route   POST /api/workspaces/join
const joinWorkspace = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Workspace join code is required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const workspace = await workspaceStore.findOne({ code: cleanCode });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found with this code' });
    }

    // Check if user is already a member
    let member = await memberStore.findOne({
      workspace: workspace._id,
      user: req.user._id
    });

    if (!member) {
      member = await memberStore.create({
        workspace: workspace._id,
        user: req.user._id,
        role: 'member'
      });
    }

    return res.json(workspace);
  } catch (error) {
    console.error('[Join Workspace Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get workspaces for current user
// @route   GET /api/workspaces
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await memberStore.findUserWorkspaces(req.user._id);
    return res.json(workspaces);
  } catch (error) {
    console.error('[Get Workspaces Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get workspace details by ID
// @route   GET /api/workspaces/:id
const getWorkspaceById = async (req, res) => {
  try {
    const workspaceId = req.params.id;

    // Verify membership
    const membership = await memberStore.findOne({
      workspace: workspaceId,
      user: req.user._id
    });

    if (!membership) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this workspace' });
    }

    const workspace = await workspaceStore.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const membersList = await memberStore.findWorkspaceMembers(workspaceId);

    return res.json({
      ...(workspace.toObject ? workspace.toObject() : workspace),
      userRole: membership.role,
      members: membersList.map(m => ({
        _id: m.user._id,
        name: m.user.name,
        email: m.user.email,
        avatarColor: m.user.avatarColor,
        role: m.role
      }))
    });
  } catch (error) {
    console.error('[Get Workspace Details Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete workspace (Owner only)
// @route   DELETE /api/workspaces/:id
const deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const membership = await memberStore.findOne({
      workspace: workspaceId,
      user: req.user._id
    });

    if (!membership || membership.role !== 'owner') {
      return res.status(403).json({ message: 'Only the workspace owner can delete this workspace' });
    }

    await workspaceStore.delete(workspaceId);
    return res.json({ message: 'Workspace deleted successfully', workspaceId });
  } catch (error) {
    console.error('[Delete Workspace Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  deleteWorkspace
};
