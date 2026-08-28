const handleTypingEvents = (io, socket) => {
  socket.on('typing:start', (data) => {
    const { workspaceId, fileId } = data;
    if (!workspaceId) return;

    socket.to(`workspace:${workspaceId}`).emit('typing:update', {
      userId: socket.user._id,
      userName: socket.user.name,
      fileId,
      isTyping: true
    });
  });

  socket.on('typing:stop', (data) => {
    const { workspaceId, fileId } = data;
    if (!workspaceId) return;

    socket.to(`workspace:${workspaceId}`).emit('typing:update', {
      userId: socket.user._id,
      userName: socket.user.name,
      fileId,
      isTyping: false
    });
  });
};

module.exports = handleTypingEvents;
