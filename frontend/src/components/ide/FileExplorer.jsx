import React, { useState } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { getFileIcon } from '../../utils/fileIcons';
import CreateFileModal from '../modals/CreateFileModal';
import RenameFileModal from '../modals/RenameFileModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import { Plus, Edit3, Trash2, Folder, ChevronDown } from 'lucide-react';

const FileExplorer = ({ workspaceId }) => {
  const { files, activeFileId, openFile } = useWorkspaceStore();
  const { theme } = useThemeStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFileForRename, setSelectedFileForRename] = useState(null);
  const [selectedFileForDelete, setSelectedFileForDelete] = useState(null);

  const isLight = theme === 'light';

  return (
    <div className={`w-full flex flex-col h-full select-none transition-colors ${
      isLight ? 'bg-white text-zinc-900' : 'bg-[#0e0e11] text-zinc-100'
    }`}>
      {/* Panel Header */}
      <div className={`h-9 px-3 border-b flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : 'bg-[#18181c] border-zinc-800 text-zinc-400'
      }`}>
        <span className="flex items-center space-x-1.5">
          <Folder className="w-3.5 h-3.5" />
          <span>Explorer</span>
        </span>

        <button
          onClick={() => setIsCreateOpen(true)}
          className={`p-1 rounded transition-colors ${
            isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Directory Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className={`flex items-center space-x-1.5 px-2 py-1 text-xs font-semibold ${
          isLight ? 'text-zinc-600' : 'text-zinc-400'
        }`}>
          <ChevronDown className="w-3.5 h-3.5" />
          <span>PROJECT FILES ({files.length})</span>
        </div>

        {/* File List */}
        <div className="pl-2 space-y-0.5">
          {files.map((file) => {
            const isActive = file._id === activeFileId;
            return (
              <div
                key={file._id}
                onClick={() => openFile(file._id)}
                className={`group flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                  isLight 
                    ? isActive 
                      ? 'bg-zinc-200 text-zinc-900 font-bold' 
                      : 'text-zinc-700 hover:bg-zinc-100'
                    : isActive 
                      ? 'bg-zinc-800 text-white font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getFileIcon(file.name)}
                  <span className="truncate font-mono text-[11px]">{file.name}</span>
                </div>

                {/* File Action Controls (Rename / Delete) */}
                <div className="hidden group-hover:flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileForRename(file);
                    }}
                    className={`p-1 rounded transition-colors ${
                      isLight ? 'hover:bg-zinc-300 text-zinc-600' : 'hover:bg-zinc-700 text-zinc-400'
                    }`}
                    title="Rename File"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileForDelete(file);
                    }}
                    className="p-1 text-red-500 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateFileModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={workspaceId}
      />

      {selectedFileForRename && (
        <RenameFileModal
          isOpen={!!selectedFileForRename}
          onClose={() => setSelectedFileForRename(null)}
          file={selectedFileForRename}
        />
      )}

      {selectedFileForDelete && (
        <DeleteConfirmModal
          isOpen={!!selectedFileForDelete}
          onClose={() => setSelectedFileForDelete(null)}
          file={selectedFileForDelete}
        />
      )}
    </div>
  );
};

export default FileExplorer;
