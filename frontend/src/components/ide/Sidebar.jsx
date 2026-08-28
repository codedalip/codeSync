import React, { useState } from 'react';
import { Files, Users, MessageSquare, Settings, Sparkles } from 'lucide-react';
import { useCollaborationStore } from '../../stores/useCollaborationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import SettingsModal from '../modals/SettingsModal';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { onlineUsers, hasUnreadMessages, markChatAsRead } = useCollaborationStore();
  const { theme } = useThemeStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isLight = theme === 'light';

  return (
    <>
      <aside className={`w-12 border-r flex flex-col justify-between items-center py-2 select-none z-10 flex-shrink-0 transition-colors ${
        isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#121215] border-zinc-800'
      }`}>
        {/* Top Navigation Icons */}
        <div className="flex flex-col space-y-1 w-full items-center">
          {/* File Explorer Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'explorer' ? null : 'explorer')}
            className={`relative p-2.5 rounded transition-colors ${
              activeTab === 'explorer'
                ? isLight
                  ? 'text-zinc-900 border-l-2 border-zinc-900 bg-white'
                  : 'text-white border-l-2 border-white bg-zinc-900'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="File Explorer"
          >
            <Files className="w-5 h-5" />
          </button>

          {/* Gemini AI Coding Assistant Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'ai' ? null : 'ai')}
            className={`relative p-2.5 rounded transition-colors ${
              activeTab === 'ai'
                ? isLight
                  ? 'text-zinc-900 border-l-2 border-zinc-900 bg-white'
                  : 'text-white border-l-2 border-white bg-zinc-900'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="Gemini AI Code Assistant"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </button>

          {/* Online Presence / Members Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'presence' ? null : 'presence')}
            className={`relative p-2.5 rounded transition-colors ${
              activeTab === 'presence'
                ? isLight
                  ? 'text-zinc-900 border-l-2 border-zinc-900 bg-white'
                  : 'text-white border-l-2 border-white bg-zinc-900'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="Online Users"
          >
            <Users className="w-5 h-5" />
            {onlineUsers.length > 0 && (
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'
              }`}>
                {onlineUsers.length}
              </span>
            )}
          </button>

          {/* Workspace Chat Tab */}
          <button
            onClick={() => {
              const nextTab = activeTab === 'chat' ? null : 'chat';
              setActiveTab(nextTab);
              if (nextTab === 'chat') {
                markChatAsRead();
              }
            }}
            className={`relative p-2.5 rounded transition-colors ${
              activeTab === 'chat'
                ? isLight
                  ? 'text-zinc-900 border-l-2 border-zinc-900 bg-white'
                  : 'text-white border-l-2 border-white bg-zinc-900'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="Workspace Chat"
          >
            <MessageSquare className="w-5 h-5" />
            {hasUnreadMessages && activeTab !== 'chat' && (
              <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse ${
                isLight ? 'bg-zinc-900' : 'bg-white'
              }`}></span>
            )}
          </button>
        </div>

        {/* Bottom Settings Icon */}
        <div className="w-full flex justify-center">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 rounded transition-colors ${
              isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="Workspace Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Settings Modal Component */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
