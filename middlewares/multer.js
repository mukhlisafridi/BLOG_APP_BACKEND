import "../config/env.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => {
      const publicId = `blog-${Date.now()}`;
      return publicId;
    },
    transformation: [{ quality: "auto" }], 
  },
});

cloudinary.api.ping()

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed!"), false);
    }
  },
});

