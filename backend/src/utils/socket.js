// src/utils/socket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Allow your React frontend
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected to WebSockets: ${socket.id}`);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};