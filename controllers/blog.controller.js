import Blog from "../models/blog.model.js";
import { errorHandler } from "../config/error.js";
import cloudinary from "../middlewares/cloudinary.js";

export const allBlogs = async (req, res, next) => {
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
};

export const createBlog = async (req, res, next) => {
  try {
   let image_url = "";
    let cloudinary_id = "";

    if (req.file) {
      image_url = req.file.path;  
      cloudinary_id = req.file.filename; 
    }

    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return next(errorHandler(400, "All fields are required..!"));
    }

    if (!req.user || !req.user._id) {
      return next(errorHandler(401, "User not authenticated!"));
    }

    const blog = await Blog.create({
      title,
      category,
      description,
      image: image_url,
      cloudinary_id,
      author: {
        id: req.user._id,
        name: req.user.name,
        image: req.user.image,
      },
    });

    console.log("Blog created:", blog);

    return res.status(201).json({
      message: "Blog Created Successfully..!",
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return next(errorHandler(500, error.message));
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return next(errorHandler(404, "Blog Not Found"));
    }

    if (blog.author.id.toString() !== req.user._id.toString()) {
      return next(
        errorHandler(401, "User Not Authorized, Can't Delete This Blog")
      );
    }
    if (blog.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(blog.cloudinary_id);
      } catch (error) {
        console.log("Cloudinary deletion error:", error);
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

export const singleBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "This Blog Is Not Found..!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const userBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ "author.id": req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};