import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import userRoutes from './routes/userRoutes.js'

// Verbindung zur MongoDB
await mongoose.connect(process.env.MONGODB_DB)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
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

app.use("/api", userRoutes);


const port = process.env.PORT || 3000;
// Server starten
app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));