import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  units: { type: String, default: "" },
  attendance: { type: String, default: "" },
  ca: { type: String, default: "" },
  exams: { type: String, default: "" },
  compulsory: { type: Boolean, default: false },
  semester: { type: String, default: "" },
});

const semesterSchema = new mongoose.Schema({
  firstSemester: [courseSchema],
  secondSemester: [courseSchema],
  thirdSemester: [courseSchema],
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    matricno: { type: String },
    password: { type: String, required: true },
    dob: { type: Date },
    sex: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.add({
  coursesAdded: semesterSchema,
  resultReady: [{ type: Boolean, required: true, default: false }],
  canEditResult: { type: Boolean, required: true, default: false },
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);
export default Users;
