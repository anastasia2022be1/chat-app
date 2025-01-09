import express from "express";
import {
  getUserSettings,
  loginUser,
  registerUser,
  updateUserSettings,
  verifyUser,
  forgotPassword,
  getResetPasswordPage,
  resetPassword,
  deleteUserAccount
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addContact,
  contactsList,
  searchContact,
} from "../controllers/addcontactController.js";

const router = express.Router();

//-------------------------------------------------------
// Register new user (POST: api/register)
router.post("/register", upload.single("profilePicture"), registerUser);

//--------------------------------------------------------
// Verify user email by token (GET: api/verify/:token)
router.get("/verify/:token", verifyUser);

//--------------------------------------------------------
// Login user (POST: api/login)
router.post("/login", loginUser);

//--------------------------------------------------------
// Forgot password (POST: api/forgot-password)
router.post("/forgot-password", forgotPassword)

//---------------------------------------------------------
// Get reset password page (GET: api/validate-reset-password/:token)
router.get('/validate-reset-password/:token', getResetPasswordPage)

//---------------------------------------------------------
// Reset password (POST: api/reset-password/:token)
router.post("/reset-password/:token", resetPassword);

//--------------------------------------------------------
// Get user settings (GET: api/settings)
router.get("/settings", authenticate, getUserSettings);

//---------------------------------------------------------
// Update user settings (PUT: api/settings/update)
router.put(
  "/settings/update",
  authenticate,
  upload.single("profilePicture"),
  updateUserSettings
);

//---------------------------------------------------------------

// Add contacts part:

// Get the list of user's contacts (GET: api/contactslist)
router.get("/contactslist", authenticate, contactsList);

// Add a new contact (POST: api/addcontact)
router.post("/addcontact", authenticate, addContact);
router.post("/search", authenticate, searchContact);

// --------------------------------------------------------------
// Delete User Account(DELETE: api/delete-acount)
router.delete("/delete-account", authenticate, deleteUserAccount);

// ---------------------------------------------------------------

export default router;
