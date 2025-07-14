// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import journeyRoutes from './routes/logRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({origin: 'https://travel-ease-indol.vercel.app/'}));
app.use(express.json());

// API Routes
app.use("/api", journeyRoutes);

// Routes placeholder
app.get("/", (req, res) => res.send("API is running!"));

// Connect to MongoDB and only then start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1); // Exit with failure
});
 