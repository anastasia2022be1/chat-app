// src/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"], // попытка WebSocket сначала
  withCredentials: true,
});

export default socket;
