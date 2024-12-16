import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// POST - create message
// http://localhost:3000/api/message

export const createMessage = async (req, res) => {
    try {
        const { chatId, content, senderId } = req.body;


        const newMessage = await Message.create({ chatId, content, senderId });

        // Add the ID of the new message to the messages array of the  chat
        await Chat.findByIdAndUpdate(chatId,
            { $push: { messages: newMessage._id } },
            { new: true }
        );

        res.status(201).json({ message: 'Message created successfully', newMessage });
    } catch (error) {
        console.error(error, 'Error');
        res.status(500).json({ error: 'Failed to create message' });
    }
};



// GET show all messages in one chat
// http://localhost:3000/api/message:chatId

export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        if (!chatId) {
            res.status(200).json([])
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 }); // Sort by ascending time

        res.status(200).json(messages);
    } catch (error) {
        console.error(error, 'Error');
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};
