import streamifier from "streamifier";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary"
import { secretKeys } from "./SecretKeys.js";



cloudinary.config({
    cloud_name : secretKeys.cloudinary.cloud_name,
    api_key : secretKeys.cloudinary.api_key,
    api_secret : secretKeys.cloudinary.api_secret
})



 

// Upload buffer to Cloudinary
let uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "events" }, // optional: put files in "events" folder
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};


const memory = new multer.memoryStorage();
 let upload = multer({ storage: memory , 
    limits: {
    fieldSize: 10 * 1024 * 1024, // Increase to 10MB for fields
    fileSize: 10 * 1024 * 1024, // 10MB for files
  }
  });

let uploads = upload.array("files" , 5)

const uploadFields = upload.fields([
  { name: "banner", maxCount: 1 },
  { name: "speakerImages", maxCount: 5 }  
]);

export {
    uploads,
    upload,
    uploadFields,
    uploadToCloudinary
}


