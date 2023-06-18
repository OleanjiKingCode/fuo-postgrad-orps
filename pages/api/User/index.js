import Users from "@/models/userSchema";
import db from "@/utils/db";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      await db.connect();
      const users = await Users.find({ role: "Student" }).exec();
      return res.status(200).json(users);
    } catch (error) {
      console.log("error", error);
    }
  }
};
