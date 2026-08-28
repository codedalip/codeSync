const { messageStore, memberStore } = require('../config/store');

// @desc    Get chat messages for workspace
// @route   GET /api/workspaces/:workspaceId/messages
const getWorkspaceMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const isMember = await memberStore.findOne({
      workspace: workspaceId,
      user: req.user._id
    });

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: You are not a workspace member' });
    }

    const messages = await messageStore.findWorkspaceMessages(workspaceId);
    return res.json(messages);
  } catch (error) {
    console.error('[Get Messages Error]', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getWorkspaceMessages
};
