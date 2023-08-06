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

  const alreadyAUserOne = await Users.findOne({ matricno: matricno });
  const alreadyAUserTwo = await Users.findOne({ email: email });

  if (alreadyAUserOne || alreadyAUserTwo) {
    res.status(422).json({
      message: "This User already exists",
    });
    await db.disConnect();
    return;
  }


  const newUser = new Users({
    name,
    email,
    password,
    phoneNumber,
    sex,
    dob,
    matricno,
    role,
    department: dept,
  });

  const user = await newUser.save();
  await db.disConnect();

  return res.status(200).json(user);
}
export default handler;
