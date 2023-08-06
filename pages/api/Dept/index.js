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
  if (req.method === "POST") {
    const { name, email, alias } = req.body;

    if (!name || !email || !alias) {
      res.status(422).json({
        message: "Validation Error",
      });
      return;
    }

    await db.connect();
    const alreadyExists = await Department.findOne({ name: name });

    if (alreadyExists) {
      res.status(422).json({
        message: "This Department already exists",
      });
      await db.disConnect();
      return;
    }

    const newDepts = new Department({
      name: name,
      alias: alias,
      createdBy: email,
      courses: [],
      maxCourses: 0,
      maxUnits: 0,
    });

    await newDepts.save();
    await db.disConnect();
    return res.status(200).json(newDepts);
  }
};
