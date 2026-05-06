'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const token = document.cookie.match(/token=([^;]+)/)?.[1];

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },        // JWT sent during handshake
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
