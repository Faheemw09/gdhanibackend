const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); // 'recursive' ensures all nested folders are created if needed
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Ensure files are saved in the correct directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Setup multer instance with the storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter,
});

module.exports = upload;
