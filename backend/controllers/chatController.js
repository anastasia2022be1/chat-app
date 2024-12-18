import Chat from "../models/Chat.js";
import User from "../models/User.js";

// POST
// http://localhost:3000/api/chat

export const createChat = async (req, res) => {
  const { senderId, recieverId } = req.body;



  
  try {
    // Check if a chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chat: existingChat,
      });
    }

    // Create new chat if it doesn't exist
    const newChat = await Chat.create({ participants: [senderId, recieverId] });

    // Add chat to users
    await User.findByIdAndUpdate(senderId, { $push: { chats: newChat._id } });
    await User.findByIdAndUpdate(recieverId, { $push: { chats: newChat._id } });

    res.status(200).json({ message: "Chat created successfully", newChat });
  } catch (error) {
    console.log(error, "Error");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET show all chats by userId
// http://localhost:3000/api/chat/:userId

export const getChats = async (req, res) => {
  try {
    const userId = req.params.userId;

        // Find all chats where the user is a paticitant
        const chats = await Chat.find({ participants: userId })
            .populate("participants", "username email") // Load participant data
            .populate({
                path: "messages",
                options: { sort: { createdAt: -1 }, limit: 5 }
            }); // If necessary, load messages

        // Optional: Format the data to give to the client
        // const chatUserData = chats.map(chat => {
        //     const otherParticipant = chat.participants.find(participant => participant._id.toString() !== userId);
        //     return {
        //         chatId: chat._id,
        //         otherParticipant: {
        //             username: otherParticipant.username,
        //             email: otherParticipant.email
        //         }
        //     };
        // });

        res.status(200).json(chats);
    } catch (error) {
        console.error(error, 'Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


