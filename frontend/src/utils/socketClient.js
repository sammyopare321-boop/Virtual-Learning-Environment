"use client";

import { io } from "socket.io-client";

export function createSocket(token) {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    auth: { token },
    transports: ["websocket"]
  });
}
