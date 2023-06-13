import Department from "@/models/deptSchema";
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
      const depts = await Department.find();
      return res.status(200).json(depts);
    } catch (error) {
      console.log("error", error);
    }
  }
};
