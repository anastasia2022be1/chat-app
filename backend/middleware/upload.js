import { v4 as uuidv4 } from "uuid";
import multer from "multer";

//multer configuration
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      const fileNameArr = file.originalname.split(".");
      const fileType = fileNameArr[fileNameArr.length - 1];
      const uniqueString = uuidv4();
      cb(null, uniqueString + "." + fileType);
    },
  });
  
  // Set up multer
  export const upload = multer({
    storage: storage,
  }); 