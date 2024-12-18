import express from "express";
import {
  getUserSettings,
  loginUser,
  registerUser,
  updateUserSettings,
  verifyUser,
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addContact,
  contactsList,
  searchContact,
} from "../controllers/addcontactController.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), registerUser);

//--------------------------------------------------------

router.get("/verify/:token", verifyUser);

//--------------------------------------------------------

router.post("/login", loginUser);

//--------------------------------------------------------

// get user settings (GET: api/settings)
router.get("/settings", authenticate, getUserSettings);

//  update user settings (PUT: api/settings/update)
router.put(
  "/settings/update",
  authenticate,
  upload.single("profilePicture"),
  updateUserSettings
);

//---------------------------------------------------------------

//add contact part:

router.get("/contactslist", authenticate, contactsList);
router.post("/addcontact", authenticate, addContact);
router.post("/search", authenticate, searchContact);


export default router;
