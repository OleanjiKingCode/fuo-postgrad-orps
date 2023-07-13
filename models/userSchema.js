import mongoose from "mongoose";

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
  coursesAdded: [
    {
      name: { type: String, default: "" },
      units: { type: String, default: "" },
      attendance: { type: String, default: "" },
      ca: { type: String, default: "" },
      exams: { type: String, default: "" },
    },
  ],
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);
export default Users;
