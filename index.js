import "./config/env.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173'  
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;


app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    message,
    success: false,
  });
});


connectDB();

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});