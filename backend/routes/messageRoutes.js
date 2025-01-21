import express from "express";
import {
  deleteMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

// router.post("/message", createMessage);
router.get("/message/:chatId", getMessages);

// DELETE a message
router.delete("/message/:messageId", deleteMessage);

export default router;
