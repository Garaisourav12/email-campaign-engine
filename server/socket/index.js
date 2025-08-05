const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Store the logged-in users: { userId -> [socketId, ...] }
const userSocketMap = {};

// Helper function to get socketId(s) by userId
const getSocketId = (userId) => userSocketMap[userId];

// Handle new socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    if (userSocketMap[userId]) {
      userSocketMap[userId].push(socket.id);
    } else {
      userSocketMap[userId] = [socket.id];
    }
  }

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }
  });
});

module.exports = { app, io, server, getSocketId };
