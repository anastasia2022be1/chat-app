import express from "express";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

// router.post("/message", createMessage);

router.get('/message/:chatId', getMessages);

export default router;