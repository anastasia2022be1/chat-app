import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Create a new instance of Resend for sending emails
const resend = new Resend(process.env.RESEND_API_KEY);

// Register a new user
// POST: api/register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const emailAddress = process.env.EMAIL_ADDRESS;


  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique verification token for email confirmation
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60; // 1 hour expiry

    // Process the profile picture, if provided
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : ""; // URL of the uploaded file

    // Create a new user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      verificationToken,
      tokenExpiresAt,
    });

    // Send a verification email to the user with the verification token link
    const emailResponse = await resend.emails.send({
      from: "talki@resend.dev",
      to: emailAddress, // Send to the user's email
      subject: "Willkommen bei Talki.dev! Bitte bestätigen Sie Ihre E-Mail-Adresse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #4CAF50; text-align: center;">Willkommen bei Talki.dev!</h1>
          <p style="color: #333; line-height: 1.6;">Danke, dass Sie sich bei Talki.dev registriert haben. Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:3000/api/verify/${verificationToken}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">E-Mail bestätigen</a>
          </div>
          <p style="color: #555; line-height: 1.4;">Wenn Sie sich nicht registriert haben, können Sie diese Nachricht ignorieren.</p>
          <footer style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            © 2024 Talki.dev. Alle Rechte vorbehalten.
          </footer>
        </div>
      `,
    });

    // Check if email was sent successfully, otherwise respond with an error
    if (emailResponse.error) {
      return res.status(500).json({
        error: "Failed to send verification email",
        details: emailResponse.error.message
      });
    }

    // Respond with the created user object
    res.status(201).json(user);
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: error.message });
  }
};
//--------------------------------------------------------------

// Verify a new user with email
// GET: api/verify/:token
export const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });

    // Check if the user exists and token is valid
    if (!user) {
      return res.status(404).json({ error: "Invalid token or user not found" });
    }

    // Check if the token has expired
    if (Date.now() > user.tokenExpiresAt) {
      return res.status(400).json({ error: "Token has expired" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Account is already verified" });
    }

    // Mark the user as verified and clear token information
    user.isVerified = true;
    user.verificationToken = null;
    user.tokenExpiresAt = null;

    await user.save();

    return res.status(200).json({ message: "Account successfully verified" });
  } catch (error) {
    console.error("Error verifying account:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//--------------------------------------------------------------

// Login user
// POST: api/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    // Convert email to lowercase to handle case-insensitive login
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    // Check if the user's account is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: "Account not verified" });
    }

    // Check if the password matches
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // Create a JWT token for authentication
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // 1-hour token expiry

    res.json({ user, token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//--------------------------------------------------------------

// Forgot Password
// POST: api/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User with this email does not exist" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60; // 1 hour expiry

    // Save token and expiry to user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiresAt;
    await user.save();

    // Generate reset link
    const resetLink = `http://localhost:5173/validate-reset-password/${resetToken}`;

    // Send email with reset link
    const emailResponse = await resend.emails.send({
      from: "talki@resend.dev",
      to: process.env.EMAIL_ADDRESS,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #4CAF50; text-align: center;">Password Reset</h1>
          <p style="color: #333; line-height: 1.6;">
            You have requested to reset your password. Please click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #555; line-height: 1.4;">
            If you did not request a password reset, please ignore this email.
          </p>
          <footer style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            © 2024 Talki.dev. All rights reserved.
          </footer>
        </div>
      `,
    });

    if (emailResponse.error) {
      return res.status(500).json({
        error: "Failed to send password reset email",
        details: emailResponse.error.message,
      });
    }

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//--------------------------------------------------------------
// GET: api/reset-password/:token
export const getResetPasswordPage = async (req, res) => {
  const { token } = req.params;

  try {
    // Find user by reset password token and ensure the token is not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If user not found or token is expired, return an error
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // If token is valid, return a success message
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Error in getResetPasswordPage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//---------------------------------------------------------------
// Reset Password
// POST: api/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Check if the new password is provided
  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // Find the user by reset password token and ensure the token is not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token should not be expired
    });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//---------------------------------------------------------------

// Get User Information (Settings Page)
// GET api/settings
export const getUserSettings = async (req, res) => {
  try {
    // Find the user by ID (user ID comes from JWT token in req.user)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the user's settings (username and profile picture URL)
    res.json({
      username: user.username,
      profilePicture: user.profilePicture || null, // Include profile picture URL
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//---------------------------------------------------------------

// Update settings (Username, Password, Profile Picture)
// PUT api/settings/update
export const updateUserSettings = async (req, res) => {
  const { username, password, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Change username
    if (username) {
      user.username = username;
    }

    // Change password
    if (password && newPassword) {
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Change profile picture
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({
      message: "User settings updated successfully",
      user: {
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
//---------------------------------------------------------------

// DELETE: api/delete-account
export const deleteUserAccount = async (req, res) => {
  try {
    // Get user ID from token (assuming middleware validates JWT and adds userId to req.user)
    const userId = req.user.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    // If the user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);


    // Send a response about successful deletion
    res.status(200).json({
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






