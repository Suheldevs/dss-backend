// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import registrationModel from "../../models/registration/registration.model.js";
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    // if (!token) return res.status(401).json({ message: "No token found"});

    // const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // const user = await registrationModel.findById(decoded.id);

    // if (!user) return res.status(401).json({ message: "Unauthorized" });

      // ⚠️ TEMPORARY: Hardcoded user ID for testing only
    const testUserId = "6880674922598bb7dec898a9";

    const user = await registrationModel.findById(testUserId);

    if (!user) return res.status(401).json({ message: "User not found with test ID" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error:error.message });
  }
};

export default  authMiddleware;
