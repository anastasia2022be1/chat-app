import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    tokenExpiresAt: {
        type: Date,
        default: () => Date.now() + 1000 * 60 * 60
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    resetPasswordToken:
        { type: String, default: null },
    resetPasswordExpires:
        { type: Date, default: null },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;