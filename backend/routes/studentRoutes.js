import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

/* GET all students */
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

export default router;
