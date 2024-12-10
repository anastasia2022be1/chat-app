import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

await mongoose.connect(process.env.MONGODB_DB)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
const app = express();

// damit express die daten aus dem body auswertet
app.use(express.json());

// Eine einfache Route
app.get('/', (req, res) => {
    res.send('Hallo, Welt!');
});

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});