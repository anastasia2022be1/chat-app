import express from "express";
import {getUserSettings, loginUser, registerUser, updateUserSettings, verifyUser} from '../controllers/userController.js'
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", upload.single("profilePicture"), registerUser);


//--------------------------------------------------------

router.get("/verify/:token", verifyUser);
  

//--------------------------------------------------------

router.post("/login", loginUser)

//--------------------------------------------------------

// Protected route to get user settings (GET: api/settings)
router.get("/settings", authenticate, getUserSettings);

// Protected route to update user settings (PUT: api/settings/update)
router.put("/settings/update", authenticate, upload.single("profilePicture"), updateUserSettings);


export default router;