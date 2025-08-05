// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (
  userId: string,
  onConnect?: (socketId: string) => void
): Socket => {
  if (socket && socket.connected) {
    if (onConnect) onConnect(socket.id || "");
    return socket;
  }

  socket = io(process.env.REACT_APP_API_URL || "http://localhost:3000", {
    auth: { userId },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
    if (onConnect) onConnect(socket?.id || "");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (onDisconnect?: () => void): void => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket connection closed");
    if (onDisconnect) onDisconnect();
    socket = null;
  }
};
