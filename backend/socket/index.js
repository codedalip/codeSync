const socketAuth = require('../middleware/socketAuthMiddleware');
const handleWorkspaceEvents = require('./workspaceHandler');
const handleEditorEvents = require('./editorHandler');
const handleCursorEvents = require('./cursorHandler');
const handleTypingEvents = require('./typingHandler');
const handleChatEvents = require('./chatHandler');
const { handlePresence } = require('./presenceHandler');

const initSocketIO = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Apply JWT Auth Middleware to socket connections
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`[Socket Connected] User: ${socket.user.name} (${socket.user._id}), Socket ID: ${socket.id}`);

    const presenceHelpers = handlePresence(io, socket);

    // Register modular event handlers
    handleWorkspaceEvents(io, socket, presenceHelpers);
    handleEditorEvents(io, socket);
    handleCursorEvents(io, socket);
    handleTypingEvents(io, socket);
    handleChatEvents(io, socket);

    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected] User: ${socket.user.name}, Socket ID: ${socket.id}`);
      presenceHelpers.removeSocketFromAllWorkspaces();
    });
  });

  return io;
};

module.exports = initSocketIO;
