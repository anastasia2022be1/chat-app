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
        Type: String,
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
        default: Date.now() + 1000 * 60 * 60
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;