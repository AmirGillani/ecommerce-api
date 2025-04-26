const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // cloudinary instance
  params: {
    folder: "ecommerce", // The Cloudinary folder where files will be stored
    resource_type: "auto", // Let Cloudinary detect type (image/video/etc)
    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "gif",
      "webp",
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
    ], // Allow videos
  },
});

// Set up Multer to handle file uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size: 10 MB
  },
});

module.exports = upload;
