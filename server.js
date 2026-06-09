 const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const {
  joinRoom,
  leaveRoom,
  sendRoomMessage,
} = require("./Services/functions/socketFunctions");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URLS
      ? process.env.FRONTEND_URLS.split(",")
      : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URLS
      ? process.env.FRONTEND_URLS.split(",")
      : ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("message", (msg) => {
    console.log(msg);
  });

  // Create a new room
  socket.on("create_room", () => {
    const roomId = crypto.randomUUID();

    joinRoom(socket, roomId);

    socket.emit("room_created", roomId);

    console.log(`Room created: ${roomId}`);
  });

  // Join an existing room
  socket.on("join_room", (roomId) => {
    if (!roomId) {
      return socket.emit("error", "Room ID required");
    }

    joinRoom(socket, roomId);

    socket.emit("joined_room", roomId);

    console.log(`${socket.id} joined ${roomId}`);
  });

  socket.on("send_room_message", (roomId, message) => {
    if (!roomId || !message) {
      return;
    }

    sendRoomMessage(io, roomId, message);

    console.log(`Room: ${roomId}`);
    console.log(`Message: ${message}`);
  });

  socket.on("leave_room", (roomId) => {
    if (!roomId) return;

    leaveRoom(socket, roomId);

    console.log(`${socket.id} left ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});