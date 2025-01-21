import express from "express";
import { deleteMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

// router.post("/message", createMessage);
router.get("/message/:chatId", getMessages);
//  router.get('/message/:chatId',  authenticate, getMessages);
//   router.post("/message/:chatId", authenticate, createMessage );


// DELETE a message
router.delete("/message/:messageId" , deleteMessage)


export default router;
