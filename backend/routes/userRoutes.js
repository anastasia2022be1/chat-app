import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import {registerUser} from '../controllers/userController.js'

const router = express.Router();


router.post("/register", registerUser);


//------------------------------------------------------------------

router.get("/verify/:token", async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });

        if (user && Date.now() < user.tokenExpiresAt) {

            if (user.isVerified) {
                return res.status(400).json({ error: "Account is already verified" });
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.tokenExpiresAt = undefined;

            await user.save();

            res.status(200).json({ message: "Account successfully verified" });
        } else {
            return res.status(400).json({ "error": "Invalid or expired token " })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//--------------------------------------------------------

export default router;