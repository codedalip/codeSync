import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from './Sidebar';
import FileExplorer from './FileExplorer';
import OnlineUsers from './OnlineUsers';
import ChatPanel from './ChatPanel';
import AIChatPanel from './panels/AIChatPanel';
import CodeEditor from './CodeEditor';
import TerminalPanel from './TerminalPanel';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useCollaborationStore } from '../../stores/useCollaborationStore';
import { connectSocket, getSocket } from '../../services/socket';

const IDELayout = ({ workspaceId, onBackToDashboard, onGoToHome }) => {
  const { token } = useAuthStore();
  const {
    activeWorkspace,
    fetchWorkspaceDetails,
    fetchFiles,
    addFileFromSocket,
    updateFileFromSocket,
    removeFileFromState,
    resetWorkspaceState,
    isLoadingFiles
  } = useWorkspaceStore();

  const {
    setOnlineUsers,
    addMessage,
    setTypingStatus,
    removeUserCursor,
    resetCollaborationState,
    setHasUnreadMessages,
    markChatAsRead
  } = useCollaborationStore();

  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer'); // 'explorer' | 'presence' | 'chat' | 'ai' | null
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizingSidebar = React.useRef(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(280);

  const handleSidebarResizeStart = (e) => {
    isResizingSidebar.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleSidebarMouseMove);
    window.addEventListener('mouseup', handleSidebarMouseUp);
  };

  const handleSidebarMouseMove = (e) => {
    if (!isResizingSidebar.current) return;
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(200, Math.min(600, startWidthRef.current + deltaX));
    setSidebarWidth(newWidth);
  };

  const handleSidebarMouseUp = () => {
    isResizingSidebar.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleSidebarMouseMove);
    window.removeEventListener('mouseup', handleSidebarMouseUp);
  };

  // Top-level hook: Mark chat as read when chat tab becomes active
  useEffect(() => {
    if (activeSidebarTab === 'chat') {
      markChatAsRead();
    }
  }, [activeSidebarTab, markChatAsRead]);

  // Initialize workspace & WebSockets
  useEffect(() => {
    if (!workspaceId || !token) return;

    // Fetch REST workspace details & files list
    fetchWorkspaceDetails(workspaceId);
    fetchFiles(workspaceId);

    // Connect socket
    const socket = connectSocket(token);

    if (socket) {
      // Emit room join event
      socket.emit('workspace:join', { workspaceId });

      // Room & presence event listeners
      const handleWorkspaceJoined = (data) => {
        if (data.users) setOnlineUsers(data.users);
      };

      const handlePresenceUpdate = (data) => {
        if (data.workspaceId === workspaceId && data.users) {
          setOnlineUsers(data.users);
        }
      };

      const handleChatMessage = (message) => {
        if (message.workspace === workspaceId) {
          addMessage(message);
          if (activeSidebarTab !== 'chat') {
            setHasUnreadMessages(true);
          }
        }
      };

      const handleTypingUpdate = (data) => {
        setTypingStatus(data.userId, data.userName, data.fileId, data.isTyping);
      };

      const handleFileCreated = (data) => {
        if (data.file) addFileFromSocket(data.file);
      };

      const handleFileRenamed = (data) => {
        if (data.file) updateFileFromSocket(data.file);
      };

      const handleFileDeleted = (data) => {
        if (data.fileId) removeFileFromState(data.fileId);
      };

      socket.on('workspace:joined', handleWorkspaceJoined);
      socket.on('presence:update', handlePresenceUpdate);
      socket.on('chat:message', handleChatMessage);
      socket.on('typing:update', handleTypingUpdate);
      socket.on('file:created', handleFileCreated);
      socket.on('file:renamed', handleFileRenamed);
      socket.on('file:deleted', handleFileDeleted);

      return () => {
        socket.emit('workspace:leave', { workspaceId });
        socket.off('workspace:joined', handleWorkspaceJoined);
        socket.off('presence:update', handlePresenceUpdate);
        socket.off('chat:message', handleChatMessage);
        socket.off('typing:update', handleTypingUpdate);
        socket.off('file:created', handleFileCreated);
        socket.off('file:renamed', handleFileRenamed);
        socket.off('file:deleted', handleFileDeleted);
        resetCollaborationState();
      };
    }

    return () => {
      resetWorkspaceState();
      resetCollaborationState();
    };
  }, [
    workspaceId,
    token,
    fetchWorkspaceDetails,
    fetchFiles,
    setOnlineUsers,
    addMessage,
    setTypingStatus,
    addFileFromSocket,
    updateFileFromSocket,
    removeFileFromState,
    resetWorkspaceState,
    resetCollaborationState,
    activeSidebarTab,
    setHasUnreadMessages
  ]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden font-sans select-none">
      {/* Navbar Header */}
      <Navbar
        onBackToDashboard={onBackToDashboard}
        onGoToHome={onGoToHome}
        isTerminalOpen={isTerminalOpen}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
      />

      {/* Main Workspace Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Sidebar Icon Navigation Bar */}
        <Sidebar activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} />

        {/* Collapsible Panel Content */}
        {activeSidebarTab && (
          <div
            style={{ width: `${sidebarWidth}px` }}
            className="h-full border-r border-zinc-800 bg-[#0c0c0e] flex flex-col overflow-hidden relative z-10 flex-shrink-0"
          >
            {activeSidebarTab === 'explorer' && <FileExplorer workspaceId={workspaceId} />}
            {activeSidebarTab === 'presence' && <OnlineUsers />}
            {activeSidebarTab === 'chat' && <ChatPanel workspaceId={workspaceId} />}
            {activeSidebarTab === 'ai' && <AIChatPanel workspaceId={workspaceId} />}

            {/* Sidebar Drag Resizer Handle */}
            <div
              onMouseDown={handleSidebarResizeStart}
              className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-zinc-700 transition-colors z-20"
            />
          </div>
        )}

        {/* Main Code Editor & Execution Terminal Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
          {/* Monaco Code Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            <CodeEditor workspaceId={workspaceId} />
          </div>

          {/* Collapsible Execution Output Terminal */}
          {isTerminalOpen && (
            <div className="h-56 border-t border-zinc-800 bg-[#0c0c0e] flex flex-col z-10">
              <TerminalPanel onClose={() => setIsTerminalOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDELayout;
