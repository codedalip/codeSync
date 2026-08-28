import React from 'react';
import ReactDOM from 'react-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { User, Mail, FolderGit2, LogOut, X } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, onLogout }) => {
  const { user, logout } = useAuthStore();
  const { workspaces } = useWorkspaceStore();
  const { theme } = useThemeStore();

  if (!isOpen || !user) return null;

  const isLight = theme === 'light';

  const handleLogoutClick = () => {
    logout();
    onClose();
    if (onLogout) onLogout();
  };

  const ownedWorkspacesCount = workspaces.filter(
    (w) => w.owner === user._id || w.role === 'owner'
  ).length;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className={`w-full max-w-sm border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#121215] border-zinc-800 text-zinc-100'
      }`}>
        {/* Header Banner */}
        <div className={`h-20 relative transition-colors ${
          isLight ? 'bg-zinc-200' : 'bg-zinc-800'
        }`}>
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
              isLight ? 'text-zinc-700 bg-white/70 hover:bg-white' : 'text-zinc-300 bg-black/40 hover:bg-black/70'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar & Info */}
        <div className="px-6 pb-6 pt-0 text-center relative flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-black shadow-xl -mt-10 mb-3 ${
            isLight ? 'bg-zinc-900 text-white border-white' : 'bg-white text-zinc-900 border-[#121215]'
          }`}>
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className={`text-lg font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{user.name}</h2>
          <div className={`flex items-center space-x-1.5 text-xs mt-1 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6 text-left">
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className={`flex items-center space-x-1.5 text-xs mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Workspaces</span>
              </div>
              <div className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{workspaces.length}</div>
            </div>

            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className={`flex items-center space-x-1.5 text-xs mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <User className="w-3.5 h-3.5" />
                <span>Owned</span>
              </div>
              <div className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{ownedWorkspacesCount}</div>
            </div>
          </div>

          {/* Sign Out Action Button */}
          <button
            onClick={handleLogoutClick}
            className={`w-full mt-6 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs shadow-md ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserProfileModal;
