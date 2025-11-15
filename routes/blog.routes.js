import express from "express"
import { allBlogs, createBlog, deleteBlog, userBlogs } from "../controllers/blog.controller.js"
import { upload } from "../middlewares/multer.js"
import { isAuthentated } from "../middlewares/isAuthenticated.js"
const router = express.Router()

router.post("/create",isAuthentated,upload.single("image"),createBlog)
router.get("/all-blogs",allBlogs)
router.get("/user-blogs",isAuthentated,userBlogs)
router.delete("/delete-blog/:id",isAuthentated,deleteBlog)


export default router