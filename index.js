import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
// middle-wares
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
//routes
import userRoutes from "./routes/user.routes.js";
app.use("/user", userRoutes);

// error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    message,
    success: false,
  });
});
connectDB();

app.listen(PORT, (req, res) => {
  console.log(`PORT IS RUNNING ON ${PORT}`);
});
