import { create } from 'zustand';
import api from '../services/api';

export const useCollaborationStore = create((set, get) => ({
  onlineUsers: [],
  remoteCursors: {}, // userId -> { userId, userName, avatarColor, fileId, position }
  remoteSelections: {}, // userId -> { userId, userName, avatarColor, fileId, selection }
  typingUsers: {}, // userId -> { userId, userName, fileId }
  messages: [],
  hasUnreadMessages: false,
  isLoadingMessages: false,

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  updateRemoteCursor: (cursorData) => {
    const { userId } = cursorData;
    set((state) => ({
      remoteCursors: {
        ...state.remoteCursors,
        [userId]: cursorData
      }
    }));
  },

  updateRemoteSelection: (selectionData) => {
    const { userId } = selectionData;
    set((state) => ({
      remoteSelections: {
        ...state.remoteSelections,
        [userId]: selectionData
      }
    }));
  },

  removeUserCursor: (userId) => {
    set((state) => {
      const nextCursors = { ...state.remoteCursors };
      delete nextCursors[userId];
      const nextSelections = { ...state.remoteSelections };
      delete nextSelections[userId];
      return {
        remoteCursors: nextCursors,
        remoteSelections: nextSelections
      };
    });
  },

  setTypingStatus: (userId, userName, fileId, isTyping) => {
    set((state) => {
      const nextTyping = { ...state.typingUsers };
      if (isTyping) {
        nextTyping[userId] = { userId, userName, fileId };
      } else {
        delete nextTyping[userId];
      }
      return { typingUsers: nextTyping };
    });
  },

  fetchMessages: async (workspaceId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await api.get(`/workspaces/${workspaceId}/messages`);
      set({ messages: res.data, isLoadingMessages: false });
    } catch (err) {
      console.error('[Fetch Messages Error]', err);
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setHasUnreadMessages: (hasUnread) => set({ hasUnreadMessages: hasUnread }),
  markChatAsRead: () => set({ hasUnreadMessages: false }),

  resetCollaborationState: () => {
    set({
      onlineUsers: [],
      remoteCursors: {},
      remoteSelections: {},
      typingUsers: {},
      messages: [],
      hasUnreadMessages: false
    });
  }
}));
