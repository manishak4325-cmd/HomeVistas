import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';

// Assuming backend runs on same domain or specific URL
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface ChatStore {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  conversations: any[];
  fetchConversations: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  conversations: [],
  
  connect: () => {
    if (!get().socket) {
      const newSocket = io(SOCKET_URL);
      set({ socket: newSocket });
    }
  },
  
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchConversations: async () => {
    try {
      const { data } = await api.get('/chat');
      set({ conversations: data });
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  },
}));
