import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'file', 'video', 'audio', 'other'], // Define allowed types
  },
  url: {
    type: String,
  }
});

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  attachments: [AttachmentSchema],
  status: {
    type: String,
    enum: ["sent", "read"],
    default: "sent"
  }
}, { timestamps: true })



const Message = mongoose.model("Message", messageSchema);

export default Message;    const messages = await Chat.findById(chatId)
//   .populate("participants", "username email")
.populate({
  path: "messages"
})