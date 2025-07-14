// routes/logRoutes.js
import express from "express";
import JourneyEntry from "../models/JourneyEntry.js";

const router = express.Router();

// POST /api/log — save single journey entry
router.post("/log", async (req, res) => {
  try {
    const entry = new JourneyEntry(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sync — save multiple entries at once
router.post("/sync", async (req, res) => {
  try {
    const entries = await JourneyEntry.insertMany(req.body);
    res.status(201).json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/logs — retrieve all journey logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await JourneyEntry.find().sort({ timestamp: 1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
