import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  seatNo: String,
  destination: String,
  phone: String,
});

export default mongoose.model("Student", studentSchema);
