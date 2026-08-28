import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { getSocket } from '../../services/socket';
import { Edit3, Loader2, AlertCircle } from 'lucide-react';

const RenameFileModal = ({ isOpen, onClose, file, workspaceId }) => {
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { renameFile } = useWorkspaceStore();
  const { theme } = useThemeStore();

  const isLight = theme === 'light';

  useEffect(() => {
    if (file) {
      setFileName(file.name);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName.trim() || !file) return;

    setIsSubmitting(true);
    setError('');

    const result = await renameFile(file._id, fileName.trim());
    setIsSubmitting(false);

    if (result.success) {
      const socket = getSocket();
      if (socket) {
        socket.emit('file:renamed', { workspaceId, file: result.file });
      }

      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename File">
      <form onSubmit={handleSubmit} className="space-y-5 select-none">
        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className={`text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-zinc-700' : 'text-zinc-300'
          }`}>
            New File Name
          </label>
          <input
            type="text"
            required
            autoFocus
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all font-mono ${
              isLight 
                ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900 focus:bg-white' 
                : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-white focus:bg-black'
            }`}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLight 
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !fileName.trim()}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow disabled:opacity-50 ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Rename File</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RenameFileModal;
