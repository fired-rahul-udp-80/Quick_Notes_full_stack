import { io } from 'socket.io-client';

let socketInstance = null;

// The backend URL fallback; when running in Vite, relative '/' or 'http://localhost:3000'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('Socket connection warning:', err.message);
    });
  }

  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
