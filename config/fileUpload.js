const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types
const allowedFileTypes = /jpeg|jpg|png/;

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    if (!file || !file.originalname) {
      console.error("❌ Invalid file detected:", file);
      return cb(new Error("Invalid file"));
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `${Date.now()}${fileExt}`;

    console.log("✅ Filename generated:", uniqueFilename);
    cb(null, uniqueFilename);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedFileTypes.test(ext)) {
    return cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
  }
  cb(null, true);
};

// Multer upload middleware with size limit & file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
});

module.exports = upload;
