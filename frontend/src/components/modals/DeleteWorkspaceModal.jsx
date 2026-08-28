import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

const DeleteWorkspaceModal = ({ isOpen, onClose, workspace }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { deleteWorkspace } = useWorkspaceStore();
  const { theme } = useThemeStore();

  const isLight = theme === 'light';

  if (!workspace) return null;

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError('');

    const res = await deleteWorkspace(workspace._id);
    setIsDeleting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to delete workspace');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Workspace">
      <div className="space-y-5 select-none">
        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className={`p-4 rounded-xl border flex items-start space-x-3.5 ${
          isLight ? 'bg-red-50 border-red-200 text-zinc-900' : 'bg-red-950/20 border-red-900/40 text-zinc-100'
        }`}>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-red-500">Permanent Action</div>
            <p className={`leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              Are you sure you want to delete workspace <span className="font-bold text-red-500">"{workspace.name}"</span>? All code files, rooms, and chat logs will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLight 
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Workspace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
