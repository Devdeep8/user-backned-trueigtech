import multer from "multer";
import path from "path";
// 1. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this path exists relative to your project root
    // Note: Create the 'public/games/csvs' folder manually if it doesn't exist yet
    cb(null, 'public/games/csvs');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid overwrites
    // e.g., 16987654321-my-games.csv
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// 2. Security: File Filter
// Even though we check on Frontend, we MUST check on Backend.
// This prevents users from uploading .exe or .sh files disguised as CSVs.
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    return cb(new Error('Only .csv files are allowed'), false);
  }
  cb(null, true);
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;