import Chat from "../models/Chat.js";
import User from "../models/User.js";

// POST 
// http://localhost:3000/api/chat

export const createChat = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;
        const newChat = await Chat.create({ participants: [senderId, recieverId] });
        res.status(200).json({ message: 'Chat created successfully', newChat });
    } catch (error) {
        console.log(error, 'Error');
    }
}

// GET show all chats by userId
// http://localhost:3000/api/chat/:userId

export const getChats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const chats = await Chat.find({ participants: { $in: [userId] } });

        const chatUserData = await Promise.all(
            chats.map(async (chat) => {
                const recieverId = chat.participants.find((participant) => participant !== userId);
                const user = await User.findById(recieverId);
                return { user: { email: user.email, username: user.username }, chatId: chat._id }
            })
        );

        // console.log("chatUserData: ", chatUserData);
        res.status(200).json(chatUserData);
    } catch (error) {
        console.log(error, 'Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
