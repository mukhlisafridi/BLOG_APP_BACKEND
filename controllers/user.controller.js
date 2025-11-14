import { errorHandler } from "../config/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw errorHandler(400, "All fields are required..!");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw errorHandler(404, "User not found..!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      image: image_filename,
    });
    return res.status(201).json({
      message: "User Created Successfully..!",
      success: true,
      user,
    });
  } catch (error) {
    throw errorHandler(500, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw errorHandler(400, "All fields are required..!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw errorHandler(404, "User not found..!");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw errorHandler(400, "Invalid Email or Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res.status(200).json({
      message: "User Loggined Successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    throw errorHandler(500, error.message);
  }
};
