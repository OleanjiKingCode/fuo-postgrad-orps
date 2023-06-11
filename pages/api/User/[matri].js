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
  const {
    method,
    body,
    query: { matri },
  } = req;
  await db.connect();

  function addSlash(input) {
    const prefix = input.substring(0, 3);
    const middle = input.substring(3, 5);
    const suffix = input.substring(5);

    return `${prefix}/${middle}/${suffix}`;
  }

  let matric = addSlash(matri);
  if (method === "GET") {
    try {
      const student = matri.includes(".com")
        ? await Users.findOne({ email: matri })
        : await Users.findOne({ matricno: matric });

      if (!student) {
        await db.disConnect();
        return res.status(404).json({ msg: "User doesnt exist" });
      }
      return res.status(200).json(student);
    } catch (error) {
      console.log("error", error);
    }
  } else if (method === "PUT") {
    try {
      const student = matri.includes("/")
        ? await Users.findOne({ email: matri })
        : await Users.findOne({ matricno: matric });
      const id = student._id;
      const updatedUser = await Users.findByIdAndUpdate(id, body, {
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
