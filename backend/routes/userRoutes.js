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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
