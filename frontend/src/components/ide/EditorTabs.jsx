import React from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { getFileIcon } from '../../utils/fileIcons';
import { X } from 'lucide-react';

const EditorTabs = () => {
  const { files, openFileIds, activeFileId, openFile, closeTab } = useWorkspaceStore();
  const { theme } = useThemeStore();

  const isLight = theme === 'light';

  const openFiles = openFileIds
    .map((id) => files.find((f) => f._id === id))
    .filter(Boolean);

  if (openFiles.length === 0) {
    return null;
  }

  const handleWheel = (e) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      onWheel={handleWheel}
      className={`h-9 flex items-center overflow-x-auto select-none border-b transition-colors ${
        isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#121215] border-zinc-800'
      }`}
    >
      {openFiles.map((file) => {
        const isActive = file._id === activeFileId;
        return (
          <div
            key={file._id}
            onClick={() => openFile(file._id)}
            className={`group h-full flex items-center space-x-2 px-3 border-r cursor-pointer text-xs transition-colors flex-shrink-0 min-w-[120px] max-w-[200px] justify-between ${
              isLight 
                ? isActive
                  ? 'bg-white text-zinc-900 font-bold border-t-2 border-t-zinc-900 border-r-zinc-200'
                  : 'bg-zinc-200/50 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border-r-zinc-200'
                : isActive
                  ? 'bg-[#18181c] text-white font-bold border-t-2 border-t-white border-r-zinc-800'
                  : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border-r-zinc-800'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              {getFileIcon(file.name)}
              <span className="truncate font-mono">{file.name}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(file._id);
              }}
              className={`p-0.5 rounded transition-colors opacity-70 group-hover:opacity-100 ${
                isLight ? 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
