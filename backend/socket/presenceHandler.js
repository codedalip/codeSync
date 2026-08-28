// In-memory mapping of active users per workspace
// Map<workspaceId, Map<socketId, { _id, name, email, avatarColor, fileId }>>
const activeWorkspaceUsers = new Map();

const getWorkspaceActiveUsers = (workspaceId) => {
  if (!activeWorkspaceUsers.has(workspaceId)) {
    return [];
  }
  const userMap = activeWorkspaceUsers.get(workspaceId);
  const uniqueUsers = new Map();
  // De-duplicate by user _id so multiple socket tabs of same user show nicely
  userMap.forEach((user) => {
    uniqueUsers.set(user._id, user);
  });
  return Array.from(uniqueUsers.values());
};

const handlePresence = (io, socket) => {
  const addUserToWorkspace = (workspaceId, user, activeFileId = null) => {
    if (!activeWorkspaceUsers.has(workspaceId)) {
      activeWorkspaceUsers.set(workspaceId, new Map());
    }
    const workspaceMap = activeWorkspaceUsers.get(workspaceId);
    workspaceMap.set(socket.id, {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      activeFileId
    });

    const activeList = getWorkspaceActiveUsers(workspaceId);
    io.to(`workspace:${workspaceId}`).emit('presence:update', {
      workspaceId,
      users: activeList
    });
  };

  const removeUserFromWorkspace = (workspaceId) => {
    if (activeWorkspaceUsers.has(workspaceId)) {
      const workspaceMap = activeWorkspaceUsers.get(workspaceId);
      workspaceMap.delete(socket.id);
      if (workspaceMap.size === 0) {
        activeWorkspaceUsers.delete(workspaceId);
      } else {
        const activeList = getWorkspaceActiveUsers(workspaceId);
        io.to(`workspace:${workspaceId}`).emit('presence:update', {
          workspaceId,
          users: activeList
        });
      }
    }
  };

  const removeSocketFromAllWorkspaces = () => {
    activeWorkspaceUsers.forEach((userMap, workspaceId) => {
      if (userMap.has(socket.id)) {
        userMap.delete(socket.id);
        if (userMap.size === 0) {
          activeWorkspaceUsers.delete(workspaceId);
        } else {
          const activeList = getWorkspaceActiveUsers(workspaceId);
          io.to(`workspace:${workspaceId}`).emit('presence:update', {
            workspaceId,
            users: activeList
          });
        }
      }
    });
  };

  return {
    addUserToWorkspace,
    removeUserFromWorkspace,
    removeSocketFromAllWorkspaces,
    getWorkspaceActiveUsers
  };
};

module.exports = {
  handlePresence,
  getWorkspaceActiveUsers
};
