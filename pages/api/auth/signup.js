import User from "../../../components/models/userSchema";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();

  const alreadyAUser = await User.findOne({ email: email });

  if (alreadyAUser) {
    res.status(422).json({
      message: "This User already exists",
    });
    await db.disConnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  const user = await newUser.save();
  await db.disConnect();

  res.send(201).json({
    message: "Created User Successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}
export default handler;
