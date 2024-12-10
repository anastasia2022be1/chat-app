import express from "express";
import {loginUser, registerUser, verifyUser} from '../controllers/userController.js'

const router = express.Router();


router.post("/register", registerUser);


//--------------------------------------------------------

router.get("/verify/:token", verifyUser);
  

//--------------------------------------------------------

router.post("/login", loginUser)


export default router;