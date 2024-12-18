import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);

// Register a new user
// POST: api/register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60; // 1 hour expiry

    // Processing the profile image
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : ""; // URL of the uploaded file

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      verificationToken,
      tokenExpiresAt,
    });

    const emailResponse = await resend.emails.send({
      from: "talki@resend.dev",
      to: email, // Send to the user's email
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

    if (emailResponse.error) {
      return res.status(500).json({
        error: "Failed to send verification email",
        details: emailResponse.error.message
      });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Verify a new user with email
// GET: api/verify/:token
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

    // Update user to mark as verified
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

// Login user
// POST: api/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Account not verified" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // 1-hour token expiry

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// To get user information (Settings Page)
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      username: user.username,
      profilePicture: user.profilePicture || null, // Include profile picture URL
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// To update settings (Username, Password, Profile Picture)

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
//------------------------------------------------------------------------------






