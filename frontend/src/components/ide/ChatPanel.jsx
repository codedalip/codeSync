import React, { useState, useEffect, useRef } from 'react';
import { useCollaborationStore } from '../../stores/useCollaborationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { getSocket } from '../../services/socket';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

const ChatPanel = ({ workspaceId }) => {
  const { user } = useAuthStore();
  const { messages, fetchMessages, isLoadingMessages } = useCollaborationStore();
  const { theme } = useThemeStore();
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);

  const isLight = theme === 'light';

  useEffect(() => {
    if (workspaceId) {
      fetchMessages(workspaceId);
    }
  }, [workspaceId, fetchMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim() || !workspaceId) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('chat:message', {
        workspaceId,
        content: content.trim()
      });
      setContent('');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`w-full flex flex-col h-full select-none transition-colors ${
      isLight ? 'bg-white text-zinc-900' : 'bg-[#0e0e11] text-zinc-100'
    }`}>
      {/* Header */}
      <div className={`h-9 px-3 border-b flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : 'bg-[#18181c] border-zinc-800 text-zinc-400'
      }`}>
        <span className="flex items-center space-x-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Workspace Chat</span>
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className={`w-6 h-6 animate-spin ${isLight ? 'text-zinc-800' : 'text-white'}`} />
          </div>
        ) : messages.length === 0 ? (
          <div className={`text-xs italic text-center py-8 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
            No messages yet. Send a message to chat with your team!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const senderObj = msg.sender || msg.user;
            const senderId = typeof senderObj === 'object' ? (senderObj?._id || senderObj?.id) : (senderObj || msg.userId);
            const currentUserId = user?._id || user?.id;

            const isMe = !!(senderId && currentUserId && String(senderId) === String(currentUserId));
            const senderName = isMe 
              ? 'You' 
              : (typeof senderObj === 'object' ? (senderObj?.name || 'Member') : 'Member');

            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 px-1">
                  <span className="font-bold">{senderName}</span>
                  <span>•</span>
                  <span>{formatTime(msg.createdAt)}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl max-w-[85%] text-xs border shadow-sm ${
                    isMe
                      ? isLight
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-900 border-white font-medium'
                      : isLight
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-900'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className={`p-3 border-t ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
      }`}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message to workspace members..."
            className={`w-full text-xs pl-3 pr-10 py-2.5 rounded-lg border focus:outline-none transition-colors ${
              isLight 
                ? 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-900 placeholder-zinc-400' 
                : 'bg-[#0e0e11] border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-500'
            }`}
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className={`absolute right-1.5 p-1.5 rounded-md transition-colors disabled:opacity-40 ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
