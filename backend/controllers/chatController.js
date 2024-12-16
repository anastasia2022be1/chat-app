import Chat from "../models/Chat.js";
import User from "../models/User.js";

// POST 
// http://localhost:3000/api/chat

export const createChat = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;
        const newChat = await Chat.create({ participants: [senderId, recieverId] });
        // const sender = await User.findByIdAndUpdate({}) // Schicken Datei in User => in Model User(chats) 
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

        const currentUser = await User.findById(userId)
        //     .populate("participants", "username email")


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

        res.status(200).json(currentUser.chats);
    } catch (error) {
        console.error(error, 'Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
