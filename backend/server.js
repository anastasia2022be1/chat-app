import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import multer from "multer";
import connect from "./config/db.js";
import userRoutes from './routes/userRoutes.js'

// Verbindung zur MongoDB
await connect();

const app = express();

// CORS-Einstellungen
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);
    
// Middleware zur JSON-Parsierung
app.use(express.json());

// static routes for uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);


const port = 3000;
// Server starten
app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));