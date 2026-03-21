import express from "express";
import User from "../models/User.js";
import { requireAuth , requireAdmin } from "../middleware/auth.js"; // ✅ ADD THIS


const router = express.Router();

// Check if user already completed details
router.get("/check/:clerkUserId", async (req, res) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.params.clerkUserId,
    });

    if (user) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile/:clerkUserId", async (req, res) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.params.clerkUserId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




/* Save user details after Clerk login */
router.post("/save-details", async (req, res) => {
  const { clerkUserId, name, seatNo, destination, phone } = req.body;

  try {
    let user = await User.findOne({ clerkUserId });

    if (user) {
      // Update existing user
      user.name = name;
      user.seatNo = seatNo;
      user.destination = destination;
      user.phone = phone;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkUserId,
        name,
        seatNo,
        destination,
        phone,
      });
    }

    res.status(200).json({ message: "User details saved", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to save user details" });
  }
});


// Update user details
router.put(
  "/update/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { destination } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { destination },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

// Delete user
router.delete("/delete/:clerkUserId", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: req.params.clerkUserId,
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.get("/profile/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ── PUT /api/users/set-trip/:clerkUserId ─────────────────
// Saves source + destination + coords and activates trip
// Body: { source, destination, sourceCoords:{lat,lng}, destCoords:{lat,lng} }
router.put("/set-trip/:clerkUserId", async (req, res) => {
  try {
    const { source, destination, sourceCoords, destCoords } = req.body;

    if (!destCoords?.lat || !destCoords?.lng)
      return res.status(400).json({ message: "destCoords required" });

    const clerkUserId = req.params.clerkUserId;
    console.log(`🗺️  set-trip for clerkUserId: ${clerkUserId}`);

    // findOneAndUpdate with upsert — creates record if user doesn't exist yet
    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        $set: {
          source,
          destination,
          sourceCoords,
          destCoords,
          tripActive:  true,
          tripAlerted: false,
          etaMinutes:  null,
        },
        // Only set these on first creation (if user doesn't exist)
        $setOnInsert: {
          clerkUserId,
          name:   "Passenger",
          seatNo: "N/A",
          phone:  "N/A",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Trip set for: ${user.name} → ${destination}`);
    res.json({ message: "Trip started", user });
  } catch (err) {
    console.error("set-trip error:", err.message);
    res.status(500).json({ message: "Failed to set trip: " + err.message });
  }
});

// ── PUT /api/users/end-trip/:clerkUserId ─────────────────
router.put("/end-trip/:clerkUserId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkUserId: req.params.clerkUserId },
      { tripActive: false, tripAlerted: false, etaMinutes: null },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Trip ended", user });
  } catch {
    res.status(500).json({ message: "Failed to end trip" });
  }
});

// ── GET /api/users/trip-status/:clerkUserId ──────────────
// Frontend polls this to get ETA and alert state
router.get("/trip-status/:clerkUserId", async (req, res) => {
  try {
    const user = await User.findOne(
      { clerkUserId: req.params.clerkUserId },
      "name seatNo source destination sourceCoords destCoords tripActive etaMinutes tripAlerted"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
