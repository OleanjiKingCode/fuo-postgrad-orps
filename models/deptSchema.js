import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    courses: [{ name: String, units: String }],
    maxUnits: { type: Number, required: true },
    maxCourses: { type: Number, required: true },
    students: [{ name: String }],
  },
  {
    timestamps: true,
  }
);


const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
export default Department;
