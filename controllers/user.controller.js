import "../config/env.js";
import { errorHandler } from "../config/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    let image_url = "";
    if (req.file) {
      image_url = req.file.path;
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required..!"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists..!"));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      image: image_url,
    });
    user.password = undefined;
    return res.status(201).json({
      message: "User Created Successfully..!",
      success: true,
      user,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "All fields are required..!"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found..!"));
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return next(errorHandler(400, "Invalid Email or Password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    user.password = undefined;
    return res.status(200).json({
      message: "User Logged in Successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
