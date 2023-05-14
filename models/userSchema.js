import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    matricno: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date },
    sex: { type: String, required: true },
    level: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    // role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
