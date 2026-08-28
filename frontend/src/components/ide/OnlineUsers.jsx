import React from 'react';
import { useCollaborationStore } from '../../stores/useCollaborationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Users, Circle } from 'lucide-react';

const OnlineUsers = () => {
  const { onlineUsers } = useCollaborationStore();
  const { theme } = useThemeStore();

  const isLight = theme === 'light';

  return (
    <div className={`w-full flex flex-col h-full select-none transition-colors ${
      isLight ? 'bg-white text-zinc-900' : 'bg-[#0e0e11] text-zinc-100'
    }`}>
      {/* Header */}
      <div className={`h-9 px-3 border-b flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : 'bg-[#18181c] border-zinc-800 text-zinc-400'
      }`}>
        <span className="flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>Active Users ({onlineUsers.length})</span>
        </span>
      </div>

      {/* Online Users List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
          isLight ? 'text-zinc-600' : 'text-zinc-400'
        }`}>
          ONLINE IN WORKSPACE
        </div>

        {onlineUsers.length === 0 ? (
          <div className={`text-xs italic py-4 text-center ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
            No active users online.
          </div>
        ) : (
          onlineUsers.map((u, idx) => {
            const displayName = u.userName || u.name || u.user?.name || 'Developer';
            const displayEmail = u.userEmail || u.email || u.user?.email || '';

            return (
              <div
                key={u.userId || u._id || idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm relative ${
                      isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'
                    }`}
                  >
                    {displayName.charAt(0).toUpperCase()}
                    <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500 absolute -bottom-0.5 -right-0.5" />
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {displayName}
                    </span>
                    {displayEmail && (
                      <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {displayEmail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
