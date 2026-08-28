const Message = require('../models/Message');

const handleChatEvents = (io, socket) => {
  socket.on('chat:message', async (data) => {
    try {
      const { workspaceId, content } = data;
      if (!workspaceId || !content || !content.trim()) return;

      const message = await Message.create({
        workspace: workspaceId,
        sender: socket.user._id,
        content: content.trim()
      });

      const populatedMessage = {
        _id: message._id,
        workspace: workspaceId,
        content: message.content,
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
          email: socket.user.email,
          avatarColor: socket.user.avatarColor
        },
        createdAt: message.createdAt
      };

      io.to(`workspace:${workspaceId}`).emit('chat:message', populatedMessage);
    } catch (err) {
      console.error('[Chat Socket Error]', err);
      socket.emit('error', { message: 'Failed to send chat message' });
    }
  });
};

module.exports = handleChatEvents;
