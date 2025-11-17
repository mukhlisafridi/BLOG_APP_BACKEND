import { errorHandler } from "../config/error.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const isAuthentated = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(errorHandler(403, "User Not Authorized..!"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(errorHandler(401, "User Not Found..!"));
    }
    next();
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
