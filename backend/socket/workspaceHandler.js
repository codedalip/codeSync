const { memberStore } = require('../config/store');

const handleWorkspaceEvents = (io, socket, presenceHelpers) => {
  // Join isolated workspace room
  socket.on('workspace:join', async (data) => {
    try {
      const { workspaceId } = data;
      if (!workspaceId) return;

      // Verify membership
      const membership = await memberStore.findOne({
        workspace: workspaceId,
        user: socket.user._id
      });

      if (!membership) {
        socket.emit('error', { message: 'Unauthorized workspace access' });
        return;
      }

      const roomName = `workspace:${workspaceId}`;
      socket.join(roomName);
      socket.currentWorkspaceId = workspaceId;

      // Add presence
      presenceHelpers.addUserToWorkspace(workspaceId, socket.user);

      console.log(`[Socket] User ${socket.user.name} joined room ${roomName}`);

      // Send confirmation event
      socket.emit('workspace:joined', {
        workspaceId,
        users: presenceHelpers.getWorkspaceActiveUsers(workspaceId)
      });
    } catch (err) {
      console.error('[Socket Join Error]', err);
      socket.emit('error', { message: 'Failed to join workspace room' });
    }
  });

  // Leave workspace room
  socket.on('workspace:leave', (data) => {
    const { workspaceId } = data;
    if (!workspaceId) return;

    const roomName = `workspace:${workspaceId}`;
    socket.leave(roomName);
    presenceHelpers.removeUserFromWorkspace(workspaceId);
    if (socket.currentWorkspaceId === workspaceId) {
      socket.currentWorkspaceId = null;
    }
    console.log(`[Socket] User ${socket.user.name} left room ${roomName}`);
  });
};

module.exports = handleWorkspaceEvents;
