import express from "express";
import cors from "cors";
import connect from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/Message.js";
import Chat from "./models/Chat.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// Verbindung zur MongoDB
await connect();

const app = express();

const server = http.Server(app);

// Initializing Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Set max listeners to avoid memory leak warning
io.sockets.setMaxListeners(100);

// Middleware zur JSON-Parsierung
app.use(express.json());
app.use(cors());

// static routes for uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("register", async ({ chatRoomId }) => {
    try {
      // Join the socket to the chat room
      socket.join(chatRoomId);
    } catch (error) {
      console.log("Error: ", error);
    }
  });

  socket.on("message", async ({ chatId, senderId, content }) => {
    try {
      // Check if message already exists in the chat
      const existingMessage = await Message.findOne({
        chatId,
        senderId,
        content,
      });

      if (!existingMessage) {
        const newMessage = await Message.create({ chatId, senderId, content });
        const populatedMessage = await Message.findById(
          newMessage._id
        ).populate({
          path: "senderId",
          select: "username _id profilePicture",
        });
        // Update the chat with the new message
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          { $push: { messages: newMessage._id } },
          { new: true }
        )
          .populate("participants", "username")
          .populate({
            path: "messages",
            populate: {
              path: "senderId",
              select: "username email profilePicture",
            },
          });

        // Emit the new message to all members in the chat room

        io.to(chatId).emit("message", populatedMessage); // Ensure `chatId` is used here
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

const port = 3000;
// Server starten
server.listen(port, () =>
  console.log(`Server started on port: http://localhost:${port}`)
);
