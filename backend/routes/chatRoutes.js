import express from "express";
import { createChat, getChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", createChat);

router.get("/chat/:userId", getChats)

export default router;