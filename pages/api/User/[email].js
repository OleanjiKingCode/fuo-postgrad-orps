import User from "../../../components/models/userSchema";
import db from "../../../utils/db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

export default async (req, res) => {
  const {
    method,
    body,
    query: { email },
  } = req;
  await db.connect();
  if (method === "GET") {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        await db.disConnect();
        return res.status(404).json({ msg: "User doesnt exist" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log("error", error);
    }
  } else if (method === "PUT") {
    try {
      const user = await User.findOne({ email: email });
      const id = user._id;
      const updatedUser = await User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        await db.disConnect();
        return res.status(404).json({ msg: "User unable to update" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error", error);
    }
  } else {
    console.log("error", error);
  }
};
