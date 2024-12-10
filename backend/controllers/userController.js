import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import User from "../models/User.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailAddress = process.env.EMAIL_ADDRESS;

export const registerUser = async(req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Invalid registration" });
    }
  
    try {
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiresAt = Date.now() + 1000 * 60 * 60;
  
      const user = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        verificationToken: verificationToken,
        tokenExpiresAt: tokenExpiresAt,
      });
  
  
      const emailResponse = await resend.emails.send({
          from: "talki@resend.dev", 
          to: emailAddress,
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
}