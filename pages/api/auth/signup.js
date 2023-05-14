import Student from "@/models/userSchema";
import db from "@/utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password, phoneNumber, level, sex, dob, matricno } =
    req.body;

  console.log(name, email, password, phoneNumber, level, sex, dob, matricno);
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5 ||
    !phoneNumber ||
    !level ||
    !sex ||
    !dob ||
    !matricno
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();

  const alreadyAUser = await Student.findOne({ email: email });

  if (alreadyAUser) {
    res.status(422).json({
      message: "This Student already exists",
    });
    await db.disConnect();
    return;
  }

  const newStudent = new Student({
    name,
    email,
    password,
    phoneNumber,
    level,
    sex,
    dob,
    matricno,
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
