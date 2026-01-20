import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Check if user already completed details
router.get("/status/:clerkUserId", async (req, res) => {
  const { clerkUserId } = req.params;

  try {
    const user = await User.findOne({ clerkUserId });

    if (user) {
      return res.json({ completed: true });
    }

    res.json({ completed: false });
  } catch (error) {
    res.status(500).json({ message: "Status check failed" });
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

export default router;
