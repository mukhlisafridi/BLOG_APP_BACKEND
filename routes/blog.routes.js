import express from "express";
import {
  allBlogs,
  createBlog,
  deleteBlog,
  singleBlog,
  userBlogs,
} from "../controllers/blog.controller.js";
import { isAuthentated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/all-blogs", allBlogs);
router.get("/single-blog/:id", singleBlog);
router.post("/create", isAuthentated, upload.single("image"), createBlog);
router.get("/user-blogs", isAuthentated, userBlogs);
router.delete("/delete-blog/:id", isAuthentated, deleteBlog);

export default router;