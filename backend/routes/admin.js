import express from "express";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/students",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const students = await User.find();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/student/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const student = await User.findById(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student" });
    }
  }
);

router.put(
  "/update/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { destination } = req.body;

      console.log("Updating ID:", req.params.id);
      console.log("New destination:", destination);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { destination },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

export default router;