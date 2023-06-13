import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    courses: [{ name: String, units: Number }],
    maxUnits: { type: Number, required: true },
    maxCourses: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
export default Department;
