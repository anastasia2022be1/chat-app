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

messageSchema = new mongoose.Schema({
    chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    },
    content: {
    type: String,
    required: true
    },
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    attachments: [AttachmentSchema],
    status : {
    type: String,
    enum:  ["sent", "read"],
    default: "sent"
    }
},{ timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;