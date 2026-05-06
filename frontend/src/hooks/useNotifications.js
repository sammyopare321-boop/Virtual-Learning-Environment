"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

export function useNotifications() {
  const socketRef = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const increment = () => setUnreadCount((count) => count + 1);
    socket.on("new_notification", increment);
    socket.on("new_announcement", increment);

    return () => {
      socket.off("new_notification", increment);
      socket.off("new_announcement", increment);
    };
  }, [socketRef]);

  return { unreadCount, setUnreadCount };
}
