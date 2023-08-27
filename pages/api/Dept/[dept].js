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
  const {
    method,
    body,
    query: { dept },
  } = req;
  await db.connect();

  if (method === "GET") {
    try {
      const department = await Department.findOne({ name: dept });

      if (!department) {
        await db.disConnect();
        return res.status(404).json({ msg: "Department doesnt exist" });
      }
      return res.status(200).json(department);
    } catch (error) {
      console.log("error", error);
    }
  } else if (method === "PUT") {
    try {
      const department = await Department.findOne({ name: dept });
      const id = department._id;
      const updatedDepartment = await Department.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!updatedDepartment) {
        await db.disConnect();
        return res.status(404).json({ msg: "Department unable to update" });
      }
      return res.status(200).json(updatedDepartment);
    } catch (error) {
      console.log("error", error);
    }
  } else {
    console.log("error", error);
  }
};
