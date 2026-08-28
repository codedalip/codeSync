import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import UserProfileModal from '../modals/UserProfileModal';
import { 
  Code2, 
  Play, 
  Copy, 
  Check, 
  LogOut, 
  FolderGit2, 
  Terminal as TerminalIcon,
  Loader2,
  Users,
  Sun,
  Moon,
  LayoutDashboard
} from 'lucide-react';

const Navbar = ({ onBackToDashboard, onGoToHome, isTerminalOpen, onToggleTerminal, onRunCode }) => {
  const { user, logout } = useAuthStore();
  const { activeWorkspace, files, activeFileId, execution, runCode } = useWorkspaceStore();
  const { theme, toggleTheme } = useThemeStore();
  const [copied, setCopied] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLight = theme === 'light';
  const activeFile = files.find((f) => f._id === activeFileId);

  const handleCopyCode = () => {
    if (activeWorkspace?.code) {
      navigator.clipboard.writeText(activeWorkspace.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunCodeClick = () => {
    if (onRunCode) {
      onRunCode();
    } else {
      runCode();
    }
  };

  return (
    <header className={`h-12 border-b flex items-center justify-between px-3 text-sm select-none z-20 transition-colors ${
      isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#09090b] border-zinc-800 text-zinc-100'
    }`}>
      {/* Left: Brand & Workspace Info */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onGoToHome || onBackToDashboard}
          className="flex items-center space-x-2 text-zinc-900 dark:text-white font-bold text-base transition-colors group"
          title="Go to Landing Page (Home)"
        >
          <div className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
            isLight ? 'bg-zinc-900 text-white border-zinc-900 group-hover:bg-zinc-800' : 'bg-white text-zinc-900 border-white group-hover:bg-zinc-200'
          }`}>
            <Code2 className="w-4 h-4" />
          </div>
          <span className={`hidden sm:inline font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            CodeSync
          </span>
        </button>

        {activeWorkspace && (
          <div className={`flex items-center space-x-2 border-l pl-3 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}>
            <FolderGit2 className="w-4 h-4 text-zinc-500" />
            <span className={`font-medium truncate max-w-[150px] sm:max-w-[220px] ${
              isLight ? 'text-zinc-800' : 'text-zinc-200'
            }`}>
              {activeWorkspace.name}
            </span>

            {/* Copy Join Code Pill */}
            <button
              onClick={handleCopyCode}
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs transition-colors border ${
                isLight 
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
              title="Click to copy join code"
            >
              <span className="font-mono font-bold">{activeWorkspace.code}</span>
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Center: Action Buttons (Run Code & Terminal Toggle) */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleRunCodeClick}
          disabled={!activeFile || execution.isExecuting}
          className={`flex items-center space-x-1.5 px-3.5 py-1 rounded text-xs font-bold shadow transition-all ${
            execution.isExecuting
              ? 'bg-zinc-500 text-zinc-200 cursor-not-allowed'
              : activeFile
              ? isLight
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
              : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
          }`}
        >
          {execution.isExecuting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleTerminal}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold border transition-colors ${
            isTerminalOpen
              ? isLight
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-900 border-white'
              : isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
          title={isTerminalOpen ? 'Hide Terminal Panel' : 'Show Terminal Panel'}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Terminal</span>
        </button>

        {activeFile && (
          <div className={`hidden md:flex items-center space-x-1 text-xs px-2 py-0.5 rounded border ${
            isLight ? 'bg-zinc-100 text-zinc-700 border-zinc-300' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}>
            <span className="capitalize">{activeFile.language}</span>
          </div>
        )}
      </div>

      {/* Right: Dashboard, Theme Toggle & User Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Dedicated Dashboard Navigation Button */}
        <button
          onClick={onBackToDashboard}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-bold border transition-all ${
            isLight 
              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
          title="Return to Workspace Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 border rounded-lg transition-colors flex items-center justify-center ${
            isLight 
              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? (
            <Sun className="w-4 h-4 text-zinc-700" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-300" />
          )}
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className={`flex items-center space-x-2 p-1 rounded-lg transition-colors ${
            isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'
          }`}
          title="View User Profile"
        >
          <div 
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow ${
              isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'
            }`}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className={`hidden md:inline font-medium text-xs ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
            {user?.name}
          </span>
        </button>

        <button
          onClick={logout}
          className={`p-1.5 rounded transition-colors ${
            isLight ? 'text-zinc-500 hover:text-red-600 hover:bg-zinc-100' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* User Profile Modal Component */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        onLogout={onBackToDashboard}
      />
    </header>
  );
};

export default Navbar;
