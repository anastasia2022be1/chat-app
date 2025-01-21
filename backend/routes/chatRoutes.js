import express from "express";
import {
  createChat,
  deleteChat,
  getChats,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", createChat);

router.get("/chat/:userId", getChats);

// DELETE route
router.delete("/chat/:chatId", deleteChat);

export default router;
