import express from "express";
import {loginUser, registerUser, verifyUser} from '../controllers/userController.js'
import { upload } from "../middleware/upload.js";

const router = express.Router();


router.post("/register", upload.single("profilePicture"), registerUser);


//--------------------------------------------------------

router.get("/verify/:token", verifyUser);
  

//--------------------------------------------------------

router.post("/login", loginUser)


export default router;