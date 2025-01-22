import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

// POST
// http://localhost:3000/api/chat

export const createChat = async (req, res) => {
  try {
    const { senderId, recieverId } = req.body;
    const newChat = await Chat.create({ participants: [senderId, recieverId] });

    await User.findByIdAndUpdate(senderId, { $push: { chats: newChat._id } });
    await User.findByIdAndUpdate(recieverId, { $push: { chats: newChat._id } });


    res.status(200).json({ message: 'Chat created successfully', newChat });
  } catch (error) {
    console.log(error, 'Error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//-------------------------------------------------------------------

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
        options: { sort: { createdAt: -1 }, limit: 5 },
      }); // If necessary, load messages

    res.status(200).json(chats);
  } catch (error) {
    console.error(error, 'Error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE
// http://localhost:3000/api/chat/:chatId

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    

    //First, we delete the chat messages
    await Message.deleteMany({ chatId: chatId });

    // Then we delete the chat
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Delete chat from related users
    await User.updateMany({ chats: chatId }, { $pull: { chats: chatId } });

    res
      .status(200)
      .json({ message: "Chat and its messages deleted successfully" });
  } catch (error) {
    console.error(error, "Error");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
