import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/message", createMessage);
 router.get('/message/:chatId', getMessages);
//  router.get('/message/:chatId',  authenticate, getMessages);
//   router.post("/message/:chatId", authenticate, createMessage );

export default router;