import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
// GET show all messages in one chat
// http://localhost:3000/api/message:chatId
export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Chat.findById(chatId).populate({
      path: "messages",
      populate: {
        path: "senderId",
        select: "username _id profilePicture",
      },
    });

    if (!messages) {
      return res.status(404).json({ error: "Chat not found" });
    }

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
