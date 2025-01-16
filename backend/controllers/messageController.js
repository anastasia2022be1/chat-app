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
        path: "messages"
      })

    res.status(200).json(messages.messages);
  } catch (error) {
    console.error(error, "Error");
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

