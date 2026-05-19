import { Server } from "socket.io";

let io: Server;

const userSocketMap = new Map<string, string>();

export const setIO = (serverIO: Server) => {
  io = serverIO;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getUserSocketMap = () => {
  return userSocketMap;
};

