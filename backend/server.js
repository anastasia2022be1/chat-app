import express from "express";
import cors from 'cors';
import connect from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


// Verbindung zur MongoDB
await connect();

const app = express();

const server = http.Server(app);

// CORS-Einstellungen
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );


const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5174',
  },
});

// Middleware zur JSON-Parsierung
app.use(express.json());

// static routes for uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);


const port = 3000;
// Server starten
app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));