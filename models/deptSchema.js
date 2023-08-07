import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    courses: [{ name: String, units: String }],
    maxUnits: [{ type: Number, required: true }],
    maxCourses: { type: Number, required: true },
    students: [{ name: String }],
  },
  {
    timestamps: true,
  }
);

departmentSchema.add({
  abbr: { type: String, required: true, default: "DEPT" },
});

const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
export default Department;
