import express from "express";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();

// ── Google Maps API Key (same as frontend) ───────────────
const GMAPS_KEY = "AIzaSyDiueVafmMYqloszSSngL3KN2EnAbRckIM";

// ── Helper: Haversine Distance (straight line) ────────────
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// ── Helper: Get ETA in minutes via Distance Matrix ───────

async function getEtaMinutes(busLat, busLng, destLat, destLng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const res = await axios.get(url, {
      params: {
        origins:      `${busLat},${busLng}`,
        destinations: `${destLat},${destLng}`,
        mode:         "driving",
        key:          GMAPS_KEY,
      },
    });

    const element = res.data?.rows?.[0]?.elements?.[0];
    if (element?.status === "OK") {
      const seconds = element.duration.value;
      return Math.round(seconds / 60);
    } else {
      console.log(`   ❌ Distance Matrix Status: ${element?.status || 'Unknown'}`);
      
      // FALLBACK: If API fails, check raw distance
      const distKm = getHaversineDistance(busLat, busLng, destLat, destLng);
      console.log(`      Fallback Distance: ${distKm.toFixed(3)} km`);
      
      if (distKm < 0.5) return 0; // If < 500m, assume 0 mins (Arrived/Near)
      return null;
    }
  } catch (err) {
    console.log(`   🔥 Distance Matrix Request Failed: ${err.message}`);
    // Same fallback for network/key errors
    const distKm = getHaversineDistance(busLat, busLng, destLat, destLng);
    if (distKm < 0.5) return 0;
    return null;
  }
}

// ── In-memory bus state ──────────────────────────────────
let busLocation   = { lat: null, lng: null, updatedAt: null };
let globalAlert   = false;


// ─────────────────────────────────────────────────────────
// POST /api/gps/update
// Called by ESP32 every 5 seconds with current bus coords
// Body: { lat, lng }
// ─────────────────────────────────────────────────────────
router.post("/update", async (req, res) => {
  try {
    const { lat, lng, forceAlert } = req.body;

    if (forceAlert) {
      globalAlert = true;
      console.log("⚡ FORCE ALERT: Manual hardware test triggered!");
      return res.json({ success: true, alertActive: true });
    }

    if (lat == null || lng == null)

      return res.status(400).json({ error: "Missing lat or lng" });

    busLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      updatedAt: new Date(),
    };

    console.log(`📍 Bus → (${lat}, ${lng})`);

    // Check all active-trip passengers
    const users = await User.find({ tripActive: true });
    let anyAlert = false;

    if (users.length === 0) {
      console.log("   ℹ️  No active trips found in DB");
    } else {
      console.log(`   🔍 Checking ${users.length} active trip(s)...`);
    }

    for (const user of users) {
      if (!user.destCoords?.lat) continue;

      const eta = await getEtaMinutes(lat, lng, user.destCoords.lat, user.destCoords.lng);

      if (eta !== null) {
        user.etaMinutes = eta;
        console.log(`   → ${user.name} (Seat ${user.seatNo}) ETA: ${eta} min`);

        if (eta <= 10 && !user.tripAlerted) {
          user.tripAlerted = true;
          anyAlert = true;
          console.log(`🚨 ALERT TRIGGERED! ${user.name} — ${eta} min away`);
        }
        if (eta <= 10) anyAlert = true;
      } else {
        console.log(`   ⚠️  ETA could not be calculated for ${user.name}`);
      }

      await user.save();
    }


    globalAlert = anyAlert;
    res.json({ success: true, busLocation, alertActive: globalAlert });

  } catch (err) {
    console.error("GPS update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/gps/alert-status
// Polled by ESP32 every 3 seconds
// ─────────────────────────────────────────────────────────
router.get("/alert-status", (req, res) => {
  res.json({ alert: globalAlert, busLocation });
});

// ─────────────────────────────────────────────────────────
// GET /api/gps/location
// Polled by React frontend for live map + ETA display
// ─────────────────────────────────────────────────────────
router.get("/location", async (req, res) => {
  try {
    const activeUsers = await User.find({ tripActive: true }).select(
      "name seatNo destination source etaMinutes tripAlerted destCoords sourceCoords"
    );
    res.json({ busLocation, alertActive: globalAlert, passengers: activeUsers });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/gps/reset-alert
// Admin resets alert state for new trip
// ─────────────────────────────────────────────────────────
router.post("/reset-alert", async (req, res) => {
  try {
    await User.updateMany(
      { tripActive: true },
      { tripAlerted: false, etaMinutes: null, tripActive: false }
    );
    globalAlert   = false;
    busLocation   = { lat: null, lng: null, updatedAt: null };
    console.log("🔄 All trips reset");
    res.json({ success: true, message: "All trip alerts reset" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
