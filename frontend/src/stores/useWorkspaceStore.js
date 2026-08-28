import { create } from 'zustand';
import api from '../services/api';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  files: [],
  activeFileId: null,
  openFileIds: [],
  isLoadingWorkspaces: false,
  isLoadingFiles: false,
  error: null,

  // Editor Preferences State
  editorSettings: {
    fontSize: 14,
    tabSize: 2,
    minimap: true,
    wordWrap: 'on'
  },

  updateEditorSettings: (newSettings) => set((state) => ({
    editorSettings: { ...state.editorSettings, ...newSettings }
  })),

  // Code Execution State
  execution: {
    isExecuting: false,
    output: '',
    error: '',
    status: null, // 'SUCCESS', 'COMPILE_ERROR', 'RUNTIME_ERROR', 'TIMEOUT'
    executionTime: null,
    memoryUsage: null,
    stdin: '',
    activeTab: 'output' // 'output' | 'stdin'
  },

  setStdin: (stdin) => set((state) => ({
    execution: { ...state.execution, stdin }
  })),

  setExecutionTab: (tab) => set((state) => ({
    execution: { ...state.execution, activeTab: tab }
  })),

  fetchWorkspaces: async () => {
    set({ isLoadingWorkspaces: true, error: null });
    try {
      const res = await api.get('/workspaces');
      set({ workspaces: res.data, isLoadingWorkspaces: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch workspaces', isLoadingWorkspaces: false });
    }
  },

  createWorkspace: async (name, description) => {
    try {
      const res = await api.post('/workspaces', { name, description });
      const newWs = res.data;
      set((state) => ({ workspaces: [newWs, ...state.workspaces] }));
      return { success: true, workspace: newWs };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create workspace' };
    }
  },

  joinWorkspace: async (code) => {
    try {
      const res = await api.post('/workspaces/join', { code });
      const ws = res.data;
      set((state) => {
        const exists = state.workspaces.some((w) => w._id === ws._id);
        return {
          workspaces: exists ? state.workspaces : [ws, ...state.workspaces]
        };
      });
      return { success: true, workspace: ws };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to join workspace' };
    }
  },

  deleteWorkspace: async (workspaceId) => {
    try {
      await api.delete(`/workspaces/${workspaceId}`);
      const savedActiveWs = localStorage.getItem('activeWorkspaceId');
      if (savedActiveWs === workspaceId) {
        localStorage.removeItem('activeWorkspaceId');
      }
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w._id !== workspaceId),
        activeWorkspace: state.activeWorkspace?._id === workspaceId ? null : state.activeWorkspace
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete workspace' };
    }
  },

  fetchWorkspaceDetails: async (workspaceId) => {
    try {
      const res = await api.get(`/workspaces/${workspaceId}`);
      set({ activeWorkspace: res.data });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch workspace details' });
      return null;
    }
  },

  fetchFiles: async (workspaceId) => {
    set({ isLoadingFiles: true });
    try {
      const res = await api.get(`/workspaces/${workspaceId}/files`);
      const filesList = res.data;
      set({ files: filesList, isLoadingFiles: false });

      // Restore saved active file for this workspace from localStorage if valid
      const savedFileId = localStorage.getItem(`activeFile_${workspaceId}`);
      const validSavedFile = filesList.find((f) => f._id === savedFileId);

      if (validSavedFile) {
        set((state) => ({
          activeFileId: validSavedFile._id,
          openFileIds: state.openFileIds.includes(validSavedFile._id)
            ? state.openFileIds
            : [...state.openFileIds, validSavedFile._id]
        }));
      } else if (filesList.length > 0 && !get().activeFileId) {
        const firstFile = filesList[0];
        set({
          activeFileId: firstFile._id,
          openFileIds: [firstFile._id]
        });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch files', isLoadingFiles: false });
    }
  },

  createFile: async (workspaceId, name, content) => {
    try {
      const res = await api.post(`/workspaces/${workspaceId}/files`, { name, content });
      const newFile = res.data;
      set((state) => ({
        files: [...state.files, newFile],
        openFileIds: state.openFileIds.includes(newFile._id) ? state.openFileIds : [...state.openFileIds, newFile._id],
        activeFileId: newFile._id
      }));
      return { success: true, file: newFile };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create file' };
    }
  },

  addFileFromSocket: (file) => {
    set((state) => {
      if (state.files.some((f) => f._id === file._id)) return {};
      return { files: [...state.files, file] };
    });
  },

  renameFile: async (fileId, newName) => {
    try {
      const res = await api.put(`/files/${fileId}`, { name: newName });
      const updatedFile = res.data;
      set((state) => ({
        files: state.files.map((f) => (f._id === fileId ? updatedFile : f))
      }));
      return { success: true, file: updatedFile };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to rename file' };
    }
  },

  updateFileFromSocket: (updatedFile) => {
    set((state) => ({
      files: state.files.map((f) => (f._id === updatedFile._id ? updatedFile : f))
    }));
  },

  deleteFile: async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      get().removeFileFromState(fileId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete file' };
    }
  },

  removeFileFromState: (fileId) => {
    set((state) => {
      const updatedFiles = state.files.filter((f) => f._id !== fileId);
      const updatedOpenIds = state.openFileIds.filter((id) => id !== fileId);
      let nextActiveId = state.activeFileId;

      if (state.activeFileId === fileId) {
        nextActiveId = updatedOpenIds.length > 0 ? updatedOpenIds[updatedOpenIds.length - 1] : null;
      }

      return {
        files: updatedFiles,
        openFileIds: updatedOpenIds,
        activeFileId: nextActiveId
      };
    });
  },

  openFile: (fileId) => {
    set((state) => {
      if (state.activeWorkspace?._id) {
        localStorage.setItem(`activeFile_${state.activeWorkspace._id}`, fileId);
      }
      return {
        openFileIds: state.openFileIds.includes(fileId) ? state.openFileIds : [...state.openFileIds, fileId],
        activeFileId: fileId
      };
    });
  },

  closeTab: (fileId) => {
    set((state) => {
      const updatedOpenIds = state.openFileIds.filter((id) => id !== fileId);
      let nextActiveId = state.activeFileId;

      if (state.activeFileId === fileId) {
        const closedIndex = state.openFileIds.indexOf(fileId);
        if (updatedOpenIds.length > 0) {
          const newIndex = Math.min(closedIndex, updatedOpenIds.length - 1);
          nextActiveId = updatedOpenIds[newIndex];
        } else {
          nextActiveId = null;
        }
      }

      return {
        openFileIds: updatedOpenIds,
        activeFileId: nextActiveId
      };
    });
  },

  setActiveFileId: (fileId) => set({ activeFileId: fileId }),

  updateFileContentLocally: (fileId, newContent) => {
    set((state) => ({
      files: state.files.map((f) => (f._id === fileId ? { ...f, content: newContent } : f))
    }));
  },

  runCode: async () => {
    const { files, activeFileId, execution } = get();
    const activeFile = files.find((f) => f._id === activeFileId);

    if (!activeFile) return;

    set((state) => ({
      execution: {
        ...state.execution,
        isExecuting: true,
        output: '',
        error: '',
        status: 'RUNNING'
      }
    }));

    try {
      const res = await api.post('/execute', {
        language: activeFile.language,
        sourceCode: activeFile.content,
        input: execution.stdin
      });

      set({
        execution: {
          isExecuting: false,
          output: res.data.output || '',
          error: res.data.error || '',
          status: res.data.status,
          executionTime: res.data.executionTime,
          memoryUsage: res.data.memoryUsage,
          stdin: execution.stdin,
          activeTab: 'output'
        }
      });
    } catch (err) {
      set({
        execution: {
          isExecuting: false,
          output: '',
          error: err.response?.data?.message || err.message || 'Execution error',
          status: 'EXEC_ERROR',
          executionTime: 0,
          memoryUsage: 'N/A',
          stdin: execution.stdin,
          activeTab: 'output'
        }
      });
    }
  },

  clearExecutionOutput: () => set((state) => ({
    execution: {
      ...state.execution,
      output: '',
      error: '',
      status: null
    }
  })),

  resetWorkspaceState: () => {
    set({
      activeWorkspace: null,
      files: [],
      activeFileId: null,
      openFileIds: [],
      execution: {
        isExecuting: false,
        output: '',
        error: '',
        status: null,
        executionTime: null,
        memoryUsage: null,
        stdin: '',
        activeTab: 'output'
      }
    });
  }
}));
