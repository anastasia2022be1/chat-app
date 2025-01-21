import Chat from "../models/Chat.js";

// GET show all messages in one chat
// http://localhost:3000/api/message:chatId
export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    //     if (!chatId) {
    //       res.status(200).json([]);
    //     }

    const messages = await Chat.findById(chatId)
      //   .populate("participants", "username email")
      .populate({
        path: "messages",
      });

    res.status(200).json(messages.messages);
  } catch (error) {
    console.error(error, "Error");
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

// DELETE a message by ID
// http://localhost:3000/api/message/:messageId
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Remove the message from the Message model
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    // Remove the message reference from the associated Chat
    await Chat.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error, "Error");
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// POST - create message
// http://localhost:3000/api/message

// export const createMessage = async (req, res) => {
//     try {
//         const { chatId, content, senderId } = req.body;

//         const newMessage = await Message.create({ chatId, content, senderId });

//         // Add the ID of the new message to the messages array of the  chat
//         await Chat.findByIdAndUpdate(chatId,
//             { $push: { messages: newMessage._id } },
//             { new: true }
//         );

//         res.status(201).json({ message: 'Message created successfully', newMessage });
//     } catch (error) {
//         console.error(error, 'Error');
//         res.status(500).json({ error: 'Failed to create message' });
//     }
// };

// GET show all messages in one chat
// http://localhost:3000/api/message:chatId

// export const getMessages = async (req, res) => {
//   try {
//     const chatId = req.params.chatId;

//     if (!chatId) {
//       res.status(200).json([]);
//     }

//      const messages = await Message.find({ chatId }).sort({ createdAt: 1 }); // Sort by ascending time

//    // Search for messages sent to the chat by the user
//   //   const messagesFromMe = await Message.find({
//   //     senderId: myId,
//   //     receiverId: chatId,
//   //   });

//   //  // Search for messages sent to the user from the chat
//   //   const messagesToMe = await Message.find({
//   //     senderId: chatId,
//   //     receiverId: myId,
//   //   });

//   //  // Combine searched messages
//   //   const messages = [...messagesFromMe, ...messagesToMe];

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error(error, "Error");
//     res.status(500).json({ error: "Failed to retrieve messages" });
//   }
// };

// export const createMessage = async (req, res) => {
//     try {
//         const {  content} = req.body;
//         const senderId = req.user._id;
//         const {chatId:receiverId} = req.params

//         const newMessage = await Message.create({ receiverId, content, senderId });

//         //socket :
//         // Get the receiver socket ID
//         const recieverSocketId = getRecieverSocketId(receiverId)
//         if (recieverSocketId) {
//             // Send message to receiver via socket
//             io.to(recieverSocketId).emit("newMessage" , newMessage)
//         }

//         res.status(201).json({ message: 'Message created successfully', newMessage });
//     } catch (error) {
//         console.error(error, 'Error');
//         res.status(500).json({ error: 'Failed to create message' });
//     }
// };
