import Blog from "../models/blog.model.js";
import { errorHandler } from "../config/error.js";
import fs from "fs";
export const allBlogs = async (req, res,next) => {
  try {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All Blogs",
      success: true,
      blogs,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
}
export const createBlog = async (req, res,next) => {
  try {
    let image_name
    if(req.file){

     image_name = `${req.file.filename}`
    }
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return next(errorHandler(400, "All field are required..!"));
    }
    const blog = await Blog.create({
      title,
      category,
      description,
      image: image_name,
      author: {
        id: req.user._id,
        name: req.user.name,
        image: req.user.image,
      },
    });
    return res.status(201).json({
      message: "Blog Created Successfully..!",
      success: true,
      blog,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
  const blog = await Blog.findById(id);
    if (!blog) {
      return next(errorHandler(404, "Blog Not Found"));
    }
    if (blog.author.id.toString() !== req.user.id.toString()) {
      return next(
        errorHandler(
          401,
          "User Not Authorized, Can't Delete This Blog"
        )
      );
    }
   if (blog.image) {
      const filePath = `uploads/${blog.image}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await blog.deleteOne();
    return res.status(200).json({
      message: "Blog Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const singleBlog =async(req,res,next)=>{
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(404).json({
                message:"This Blog Is Not Found..!",
                success:false
            })
        }
        return res.status(200).json({
          success:true,
          blog
        })
    } catch (error) {
        next(errorHandler(500,error.message))
    }
}
export const userBlogs =async (req,res,next)=>{
    try {
        const blogs = await Blog.find({"author.id":req.user._id})
        return res.status(200).json({
          success:true,
          blogs
        })
    } catch (error) {
        next(errorHandler(500,error.message))
    }
}