import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db";

export const logInRoute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });

    if (!user) return res.status(401).json({ message: "unauthorized user" });

    const { _id: id, isVerified, passwordHash, info } = user;

    const isCorrect = await bcrypt.compare(password, passwordHash);

    if (isCorrect) {
      jwt.sign(
        { id, isVerified, email, info },
        process.env.JWT_SECRET,
        { expiresIn: "2m" },
        (err, token) => {
          if (err) {
            res.status(500).json(err);
          }

          res.status(200).json({ message: "Login successful", id: id, token });
        }
      );
    } else {
      res.status(401).json({ message: "Please check your credentials" });
    }
  },
};
