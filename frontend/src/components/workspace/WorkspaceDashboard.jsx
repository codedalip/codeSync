import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import JoinWorkspaceModal from './JoinWorkspaceModal';
import UserProfileModal from '../modals/UserProfileModal';
import DeleteWorkspaceModal from '../modals/DeleteWorkspaceModal';
import { 
  FolderGit2, 
  Plus, 
  LogIn, 
  Users, 
  Code2, 
  ArrowRight, 
  Loader2,
  Copy,
  Check,
  Sparkles,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

const WorkspaceDashboard = ({ onSelectWorkspace, onGoToHome }) => {
  const { user, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, isLoadingWorkspaces, deleteWorkspace } = useWorkspaceStore();
  const { theme, toggleTheme } = useThemeStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [deleteTargetWorkspace, setDeleteTargetWorkspace] = useState(null);

  const isLight = theme === 'light';

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCopyCode = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteWorkspace = (e, ws) => {
    e.stopPropagation();
    setDeleteTargetWorkspace(ws);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 flex flex-col ${
      isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      {/* Header Bar */}
      <header className={`h-16 border-b px-6 flex items-center justify-between transition-colors ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#09090b] border-zinc-800 shadow-md'
      }`}>
        <div 
          onClick={onGoToHome}
          className="flex items-center space-x-3 cursor-pointer select-none group"
          title="Go to Home (Landing Page)"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
            isLight 
              ? 'bg-zinc-900 text-white border-zinc-900 group-hover:opacity-90' 
              : 'bg-white text-zinc-900 border-white group-hover:bg-zinc-200'
          }`}>
            <Code2 className="w-5 h-5" />
          </div>
          <span className={`font-bold text-xl tracking-tight transition-opacity group-hover:opacity-80 ${
            isLight ? 'text-zinc-900' : 'text-white'
          }`}>
            CodeSync
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Professional Theme Switcher Toggle Pill */}
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-300 text-zinc-800'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-zinc-700" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-300" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className={`flex items-center space-x-2 p-1.5 rounded-lg transition-colors ${
              isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'
            }`}
            title="View User Profile"
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'
              }`}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
              {user?.name}
            </span>
          </button>

          <button
            onClick={logout}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              isLight 
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Welcome Hero */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-2xl border shadow-lg transition-colors ${
          isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-[#121215] border-zinc-800 text-zinc-100'
        }`}>
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Collaborative Coding</span>
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Welcome back, {user?.name}!
            </h1>
            <p className={`text-sm max-w-xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Create a workspace to start coding with your team or join an existing session using a workspace code.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className={`font-bold px-4 py-2.5 rounded-lg shadow-md flex items-center space-x-2 text-sm transition-all ${
                isLight 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                  : 'bg-white hover:bg-zinc-200 text-zinc-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Workspace</span>
            </button>

            <button
              onClick={() => setIsJoinOpen(true)}
              className={`font-semibold px-4 py-2.5 rounded-lg border flex items-center space-x-2 text-sm transition-all ${
                isLight 
                  ? 'bg-white hover:bg-zinc-200/60 border-zinc-300 text-zinc-800' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Join Workspace</span>
            </button>
          </div>
        </div>

        {/* Workspaces List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold flex items-center space-x-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              <FolderGit2 className="w-5 h-5" />
              <span>Your Workspaces</span>
            </h2>
            <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{workspaces.length} Total</span>
          </div>

          {isLoadingWorkspaces ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className={`w-8 h-8 animate-spin ${isLight ? 'text-zinc-800' : 'text-white'}`} />
            </div>
          ) : workspaces.length === 0 ? (
            <div className={`border border-dashed rounded-xl p-12 text-center space-y-4 ${
              isLight ? 'bg-white border-zinc-300' : 'bg-[#121215] border-zinc-800'
            }`}>
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border ${
                isLight ? 'bg-zinc-100 text-zinc-800 border-zinc-200' : 'bg-zinc-900 text-white border-zinc-800'
              }`}>
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>No Workspaces Found</h3>
              <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                You haven't created or joined any workspaces yet. Get started by creating your first workspace.
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className={`font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center space-x-1.5 shadow ${
                  isLight ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-200 text-zinc-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Workspace</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws) => {
                const isOwner = ws.role === 'owner' || ws.owner === user?._id || ws.owner?._id === user?._id;
                return (
                  <div
                    key={ws._id}
                    onClick={() => onSelectWorkspace(ws._id)}
                    className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-md relative ${
                      isLight 
                        ? 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-400' 
                        : 'bg-[#121215] hover:bg-[#18181c] border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-lg border transition-colors ${
                            isLight 
                              ? 'bg-zinc-100 text-zinc-900 border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white' 
                              : 'bg-zinc-900 text-white border-zinc-800 group-hover:bg-white group-hover:text-zinc-900'
                          }`}>
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`font-bold text-base truncate max-w-[150px] transition-colors ${
                              isLight ? 'text-zinc-900 group-hover:text-zinc-900' : 'text-white group-hover:text-white'
                            }`}>
                              {ws.name}
                            </h3>
                            <span className={`text-[11px] capitalize ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              Role: {ws.role || 'Member'}
                            </span>
                          </div>
                        </div>

                        {/* Copy Code Pill */}
                        <button
                          onClick={(e) => handleCopyCode(e, ws.code)}
                          className={`flex items-center space-x-1 text-xs px-2 py-1 rounded border transition-colors ${
                            isLight 
                              ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800' 
                              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                          }`}
                          title="Copy Join Code"
                        >
                          <span className="font-mono text-xs font-bold">{ws.code}</span>
                          {copiedCode === ws.code ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-400" />
                          )}
                        </button>
                      </div>

                      <p className={`text-xs line-clamp-2 min-h-[32px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {ws.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className={`flex items-center justify-between pt-4 mt-2 border-t ${
                      isLight ? 'border-zinc-100' : 'border-zinc-800/80'
                    }`}>
                      <div className={`flex items-center space-x-2 text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        <Users className="w-3.5 h-3.5" />
                        <span>{ws.owner?.name || 'Owner'}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isOwner && (
                          <button
                            onClick={(e) => handleDeleteWorkspace(e, ws)}
                            disabled={deleteTargetWorkspace?._id === ws._id}
                            className={`p-1 rounded transition-colors ${
                              isLight ? 'text-zinc-400 hover:text-red-600 hover:bg-red-50' : 'text-zinc-500 hover:text-red-400 hover:bg-red-950/30'
                            }`}
                            title="Delete Workspace"
                          >
                            {deleteTargetWorkspace?._id === ws._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <span className={`flex items-center space-x-1 text-xs font-bold group-hover:translate-x-1 transition-transform ${
                          isLight ? 'text-zinc-900' : 'text-white'
                        }`}>
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSelectWorkspace={onSelectWorkspace}
      />
      <JoinWorkspaceModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSelectWorkspace={onSelectWorkspace}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <DeleteWorkspaceModal
        isOpen={!!deleteTargetWorkspace}
        onClose={() => setDeleteTargetWorkspace(null)}
        workspace={deleteTargetWorkspace}
      />
    </div>
  );
};

export default WorkspaceDashboard;
