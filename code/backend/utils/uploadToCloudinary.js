import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * Uploads a buffer to Cloudinary using a stream.
 * @param {Buffer} buffer - File buffer from multer.memoryStorage().
 * @param {string} folder - Cloudinary folder path (e.g. "Medibook_project/doctors").
 * @param {string} public_id - Optional unique name (doctor name, user id, etc.)
 */
export const uploadToCloudinary = (buffer, folder, public_id) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
