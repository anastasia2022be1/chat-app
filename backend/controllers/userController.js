import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);


// Utility to hash passwords
const hashPassword = async (password) => bcrypt.hash(password, 10);

// Utility to generate a random verification token
const generateVerificationToken = () => ({
  token: crypto.randomBytes(32).toString("hex"),
  expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
});

// Utility to send verification email
const sendVerificationEmail = async (email, token) => {
  return await resend.emails.send({
    from: "talki@resend.dev",
    to: email,
    subject: "Willkommen bei Talki.dev! Bitte bestätigen Sie Ihre E-Mail-Adresse",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #4CAF50; text-align: center;">Willkommen bei Talki.dev!</h1>
        <p style="color: #333; line-height: 1.6;">Danke, dass Sie sich bei Talki.dev registriert haben. Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:3000/api/verify/${token}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">E-Mail bestätigen</a>
        </div>
        <p style="color: #555; line-height: 1.4;">Wenn Sie sich nicht registriert haben, können Sie diese Nachricht ignorieren.</p>
        <footer style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          © 2024 Talki.dev. Alle Rechte vorbehalten.
        </footer>
      </div>
    `,
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const { token, expiresAt } = generateVerificationToken();
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      verificationToken: token,
      tokenExpiresAt: expiresAt,
    });

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, token);
    if (emailResponse.error) {
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    res.status(201).json({ message: "User registered successfully. Please verify your email." });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify user email
export const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid token or user not found" });
    }

    if (Date.now() > user.tokenExpiresAt) {
      return res.status(400).json({ error: "Token has expired" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Account is already verified" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.tokenExpiresAt = null;

    await user.save();

    res.status(200).json({ message: "Account successfully verified" });
  } catch (error) {
    console.error("Error verifying account:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Account not verified" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


//------------------------------------------------------------------------------------------- 

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ username: user.username, profilePicture: user.profilePicture || null });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  const { username, password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username
    if (username) {
      user.username = username;
    }

    // Update password
    if (password && newPassword) {
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      user.password = await hashPassword(newPassword);
    }

    // Update profile picture
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "User settings updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};






