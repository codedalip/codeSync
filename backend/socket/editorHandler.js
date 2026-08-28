const { fileStore } = require('../config/store');

// Debounce map for auto-saving file content to DB/store without hammering persistence
// Map<fileId, setTimeoutHandle>
const autoSaveTimers = new Map();

const handleEditorEvents = (io, socket) => {
  // User opened a file
  socket.on('editor:join', (data) => {
    const { workspaceId, fileId } = data;
    if (!workspaceId || !fileId) return;

    socket.activeFileId = fileId;
    socket.to(`workspace:${workspaceId}`).emit('editor:user-joined', {
      fileId,
      user: socket.user
    });
  });

  // User left a file
  socket.on('editor:leave', (data) => {
    const { workspaceId, fileId } = data;
    if (!workspaceId || !fileId) return;

    socket.to(`workspace:${workspaceId}`).emit('editor:user-left', {
      fileId,
      userId: socket.user._id
    });
  });

  // User made code edits
  socket.on('editor:change', (data) => {
    const { workspaceId, fileId, changes, fullContent, version } = data;
    if (!workspaceId || !fileId) return;

    // Broadcast change to everyone in the workspace room EXCEPT sender
    socket.to(`workspace:${workspaceId}`).emit('editor:update', {
      fileId,
      userId: socket.user._id,
      userName: socket.user.name,
      changes,
      fullContent,
      version,
      timestamp: Date.now()
    });

    // Schedule debounced auto-save (1.5 seconds after typing stops)
    if (fullContent !== undefined) {
      if (autoSaveTimers.has(fileId)) {
        clearTimeout(autoSaveTimers.get(fileId));
      }

      const timer = setTimeout(async () => {
        try {
          await fileStore.update(fileId, { content: fullContent });
          autoSaveTimers.delete(fileId);
        } catch (err) {
          console.error(`[AutoSave Error] File ${fileId}:`, err.message);
        }
      }, 1500);

      autoSaveTimers.set(fileId, timer);
    }
  });

  // Structural file events (file created, renamed, deleted)
  socket.on('file:created', (data) => {
    const { workspaceId, file } = data;
    if (!workspaceId) return;
    socket.to(`workspace:${workspaceId}`).emit('file:created', { file });
  });

  socket.on('file:renamed', (data) => {
    const { workspaceId, file } = data;
    if (!workspaceId) return;
    socket.to(`workspace:${workspaceId}`).emit('file:renamed', { file });
  });

  socket.on('file:deleted', (data) => {
    const { workspaceId, fileId } = data;
    if (!workspaceId) return;
    socket.to(`workspace:${workspaceId}`).emit('file:deleted', { fileId });
  });
};

module.exports = handleEditorEvents;
