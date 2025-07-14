// models/JourneyEntry.js
import mongoose from "mongoose";

const journeyEntrySchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  note: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  pathIndex: { type: Number }, // optional: used for canvas path ordering
  syncedFrom: { type: String, enum: ["client", "background"], default: "client" },
  createdAt: { type: Date, default: Date.now }
});

const JourneyEntry = mongoose.model("JourneyEntry", journeyEntrySchema);

export default JourneyEntry;
