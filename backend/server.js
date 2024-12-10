import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import userRoutes from './routes/userRoutes.js'

await mongoose.connect(process.env.MONGODB_DB)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
const app = express();


app.use(cors())
// damit express die daten aus dem body auswertet
app.use(express.json());

app.use("/api", userRoutes);

const port = process.env.PORT || 3000;
// Server starten
app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));