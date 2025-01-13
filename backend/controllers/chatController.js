import Chat from "../models/Chat.js";
import User from "../models/User.js";

// POST 
// http://localhost:3000/api/chat

export const createChat = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;

        // Checking that both users exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(recieverId);

        if (!sender) {
            // return res.status(404).json({ error: `Sender with ID ${senderId} not found` });
            console.log('Not sender')
        }

        if (!receiver) {
            // return res.status(404).json({ error: `Receiver with ID ${recieverId} not found` });
            console.log('Not reciever')
        }


        // Checking an existing chat between two users
        const existingChat = await Chat.findOne({
            participants: { $all: [senderId, recieverId], $size: 2 }
        });

        if (existingChat) {
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
        }

        // Creating new chat
        const newChat = await Chat.create({
            participants: [senderId, recieverId],
        });

        // Adding a chat to the list of user chats
        await User.findByIdAndUpdate(senderId, { $push: { chats: newChat._id } });
        await User.findByIdAndUpdate(recieverId, { $push: { chats: newChat._id } });

        res.status(200).json({ message: 'Chat created successfully', newChat });
    } catch (error) {
        console.log(error, 'Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

        res.status(200).json(chats);
    } catch (error) {
        console.error(error, 'Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


