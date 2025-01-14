import Message from "../models/Message.js";

// GET show all messages in one chat
// http://localhost:3000/api/message:chatId
export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    if (!chatId) {
      res.status(200).json([]);
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 }); // Sort by ascending time

    res.status(200).json(messages);
  } catch (error) {
    console.error(error, "Error");
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

