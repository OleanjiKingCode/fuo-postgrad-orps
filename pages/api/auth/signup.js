import Users from "@/models/userSchema";
import db from "@/utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password, phoneNumber, sex, dob, matricno, dept } =
    req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5 ||
    !phoneNumber ||
    !sex ||
    !dob ||
    !matricno ||
    !dept
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();

  const alreadyAUser = await Users.findOne({ email: email });

  if (alreadyAUser) {
    res.status(422).json({
      message: "This User already exists",
    });
    await db.disConnect();
    return;
  }

  let role = matricno.includes("LEC") ? "Lecturer" : "Student";
  let department = dept;

  const newStudent = new Users({
    name,
    email,
    password,
    phoneNumber,
    sex,
    dob,
    matricno,
    role,
    department,
  });

  const student = await newStudent.save();
  await db.disConnect();

  res.send(201).json({
    message: "Created Student Successfully",
    _id: student._id,
    name: student.name,
    email: student.email,
  });
}
export default handler;
