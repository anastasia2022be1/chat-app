// emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("📨 SMTP login:", process.env.BREVO_EMAIL);
console.log("🔐 SMTP password (shortened):", process.env.BREVO_SMTP_KEY?.slice(0, 8));

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,      
    pass: process.env.BREVO_SMTP_KEY 
  },
});
