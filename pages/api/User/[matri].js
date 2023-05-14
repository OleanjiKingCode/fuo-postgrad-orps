import Student from "@/models/userSchema";
import db from "@/utils/db";

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
    query: { matri },
  } = req;
  await db.connect();
  if (method === "GET") {
    try {
      function addSlash(input) {
        const regex = /^([A-Z]{3})(\d{2})(\d{4})$/;
        const match = input.match(regex);

        if (match) {
          const [, prefix, middle, suffix] = match;
          return `${prefix}/${middle}/${suffix}`;
        }

        return input;
      }
      let matric = addSlash(matri);
      const student = await Student.findOne({ matricno: matric });

      if (!student) {
        await db.disConnect();
        return res.status(404).json({ msg: "Student doesnt exist" });
      }
      return res.status(200).json(student);
    } catch (error) {
      console.log("error", error);
    }
  } else if (method === "PUT") {
    try {
      const student = await Student.findOne({ matricno: matric });
      const id = student._id;
      const updatedUser = await Student.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        await db.disConnect();
        return res.status(404).json({ msg: "Student unable to update" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error", error);
    }
  } else {
    console.log("error", error);
  }
};
