// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import registrationModel from "../../models/sales.model/sales.registration.model/registration.model.js";
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
      
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token found"});

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await registrationModel.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error:error.message });
  }
};

export default  authMiddleware;
