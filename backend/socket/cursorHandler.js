const handleCursorEvents = (io, socket) => {
  // Cursor movement event
  socket.on('cursor:change', (data) => {
    const { workspaceId, fileId, position } = data;
    if (!workspaceId || !fileId || !position) return;

    socket.to(`workspace:${workspaceId}`).emit('cursor:update', {
      userId: socket.user._id,
      userName: socket.user.name,
      avatarColor: socket.user.avatarColor,
      fileId,
      position
    });
  });

  // Text selection event
  socket.on('selection:change', (data) => {
    const { workspaceId, fileId, selection } = data;
    if (!workspaceId || !fileId || !selection) return;

    socket.to(`workspace:${workspaceId}`).emit('selection:update', {
      userId: socket.user._id,
      userName: socket.user.name,
      avatarColor: socket.user.avatarColor,
      fileId,
      selection
    });
  });
};

module.exports = handleCursorEvents;
