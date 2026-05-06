"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { createSocket } from "@/utils/socketClient";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
    if (!token) return;

    socketRef.current = createSocket(decodeURIComponent(token));

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
