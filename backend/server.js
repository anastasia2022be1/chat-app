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
      console.log("Registered for chat room:", chatRoomId);

      // Join the socket to the chat room
      socket.join(chatRoomId);
    } catch (error) {
      console.log("Error: ", error);
    }
  });

  // socket.on("message", async ({ chatId, senderId, content }) => {
  //   try {
  //     // Check if message already exists in the chat
  //     const existingMessage = await Message.findOne({ chatId, senderId, content });

  //     if (!existingMessage) {
  //       const newMessage = await Message.create({ chatId, senderId, content });

  //       // Update the chat with the new message
  //       const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } }, { new: true })
  //         .populate('participants', 'username')
  //         .populate({ path: 'messages', populate: { path: 'senderId', select: 'username email' } });

  //       // Emit the new message to all members in the chat room
  //       io.to(chatId).emit('message', newMessage); // Ensure `chatId` is used here
  //     }
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  // });

  socket.on("message", async ({ chatId, senderId, content, file }) => {
    try {
      const newMessage = await Message.create({
        chatId,
        senderId,
        content,
        file,
      });

      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: newMessage._id } },
        { new: true }
      )
        .populate("participants", "username")
        .populate({
          path: "messages",
          populate: { path: "senderId", select: "username email" },
        });

      io.to(chatId).emit("message", newMessage); // Emit message to all members of the chat
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

// import express from "express";
// import cors from "cors";
// import connect from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import Message from "./models/Message.js";
// import Chat from "./models/Chat.js";
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import { log } from "console";

// // Verbindung zur MongoDB
// await connect();

// const app = express();

// const server = http.Server(app);

// // Initializing Socket.IO
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// // Set max listeners to avoid memory leak warning
// io.sockets.setMaxListeners(30); // or any number greater than 10

// // Middleware zur JSON-Parsierung
// app.use(express.json());
// app.use(cors());

// // static routes for uploaded files
// app.use("/uploads", express.static("uploads"));

// app.use("/api", userRoutes);
// app.use("/api", chatRoutes);
// app.use("/api", messageRoutes);

// // Socket.io
// // io.on("connection", (socket) => {
// //   console.log(`User  ${socket.id} connected`);
// //   socket.on("register", async ({chatRoomId}) => {
// //     try {
// //       console.log(chatRoomId)

// //       socket.on("message", async ({ chatId, senderId, content }) => {
// //         // console.log(data);

// //         const newMessage = await Message.create({
// //           chatId,
// //           senderId,
// //           content,
// //         });

// //         const checkResult = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } }).populate('participants', 'username')
// //           .populate({
// //             path: 'messages',
// //             populate: {
// //               path: 'senderId',
// //               select: 'username email'
// //             }
// //           });
// //         console.log(checkResult.messages)
// //         io.to(chatRoomId).emit('message', checkResult.messages);
// //       });
// //     } catch (error) {
// //       console.log("Error: ", error);
// //     }

// //   })
// //   socket.on("disconnect", () => {
// //     console.log(`User ${socket.id} disconnected`);
// //   });
// // });

// io.on("connection", (socket) => {
//   console.log(`User ${socket.id} connected`);

//   socket.on("register", async ({ chatRoomId }) => {
//     try {
//       console.log("Registered for chat room:", chatRoomId);

//       // Join the socket to the chat room
//       socket.join(chatRoomId);

//       socket.on("message", async ({ chatId, senderId, content }) => {
//         // Check if message already exists in the chat
//         const existingMessage = await Message.findOne({ chatId, senderId, content });

//         if (!existingMessage) {
//           const newMessage = await Message.create({ chatId, senderId, content });

//           // Update the chat with the new message
//           const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } }, { new: true })
//             .populate('participants', 'username')
//             .populate({ path: 'messages', populate: { path: 'senderId', select: 'username email' } });

//           // Emit the new message to all members in the chat room
//           io.to(chatRoomId).emit('message', newMessage); // Send the new message to the client
//         }
//       });
//     } catch (error) {
//       console.log("Error: ", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User ${socket.id} disconnected`);
//   });
// });

// // io.on('connection', onConnection);

// // function onConnection(socket) {
// //   console.log('New connection', socket.id)
// //   const { room } = socket.handshake.query;

// //   socket.join(room);

// //   socket.on('message:created', (message) => {
// //     console.log('New message', message);
// //     io.to(room).emit('message:created', message)
// //   })
// // }

// const port = 3000;
// // Server starten
// server.listen(port, () =>
//   console.log(`Server started on port: http://localhost:${port}`)
// );
