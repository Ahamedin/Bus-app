import mongoose from "mongoose";

const coordSchema = new mongoose.Schema(
  { lat: Number, lng: Number },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    seatNo: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    // ── Trip Tracking Fields ──────────────────
    source: { type: String, default: "" },
    sourceCoords: { type: coordSchema, default: null },
    destCoords:   { type: coordSchema, default: null },
    tripActive:   { type: Boolean, default: false },
    etaMinutes:   { type: Number, default: null },
    tripAlerted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
