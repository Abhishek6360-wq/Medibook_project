// backend/middlewares/multer.js
import multer from "multer";

// Use memory storage (no local file saved)
const storage = multer.memoryStorage();

// You can also set file size limits or filter types if you want
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image uploads are allowed"), false);
    }
  },
});

export default upload;
