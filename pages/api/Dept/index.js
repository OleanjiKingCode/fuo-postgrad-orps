import Department from "@/models/deptSchema";
import db from "@/utils/db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
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
    const { name, email, abbr } = req.body;

    if (!name || !email || !abbr) {
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
      name,
      abbr,
      createdBy: email,
      courses: [],
      maxUnits: [0, 0, 0],
    });

    await newDepts.save();
    await db.disConnect();
    return res.status(200).json(newDepts);
  }
};
