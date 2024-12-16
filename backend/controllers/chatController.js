import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;
        const newChat = await Chat.create({ participants: [senderId, recieverId] });
        res.status(200).json({ message: 'Chat created successfully', newChat });
    } catch (error) {
        console.log(error, 'Error');
    }
}