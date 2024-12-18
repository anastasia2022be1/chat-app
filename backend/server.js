import express from "express";
import cors from 'cors';
import connect from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import Message from "./models/Message.js";
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
    origin: 'http://localhost:5173',
  },
});

// Middleware zur JSON-Parsierung
app.use(express.json());
app.use(cors());

// static routes for uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log(`User  ${socket.id} connected`);
  socket.on('message', async ({ chatId, senderId, content }) => {
    // console.log(data);
    try {
      const newMessage = await Message.create({
        chatId,
        senderId,
        content,
      });

      await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });

      io.to(chatId).emit('message', newMessage);
    } catch (error) {
      console.log('Error: ', error);
    }
  });
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

const port = 3000;
// Server starten
server.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));