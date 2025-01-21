import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";

// //multer configuration
// const storage = multer.diskStorage({
//     destination: "uploads/",
//     filename: function (req, file, cb) {
//       const fileNameArr = file.originalname.split(".");
//       const fileType = fileNameArr[fileNameArr.length - 1];
//       const uniqueString = uuidv4();
//       cb(null, uniqueString + "." + fileType);
//     },
//   });
  
//   // Set up multer
//   export const upload = multer({
//     storage: storage,
//   }); 


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer instance with file size limit and type filtering
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image", "video", "audio", "application"];
    const fileType = file.mimetype.split("/")[0];
    if (allowedTypes.includes(fileType)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});