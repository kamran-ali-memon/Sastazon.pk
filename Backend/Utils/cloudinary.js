import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

// Load environment variables from .env
config();

// Configure Cloudinary with your project credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This function uploads one or many image files to Cloudinary
export const uploadMultipleToCloudinary = async (files) => {
  // If no files were sent, return an empty list
  if (!files || files.length === 0) {
    return [];
  }

  // We upload every file in parallel using Promise.all
  const uploadImages = files.map(async (file) => {
    try {
      // Cloudinary upload_stream is used because multer gives us file.buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'sastazon/products' },
          (error, uploadedFile) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(uploadedFile);
          }
        );

        // Send file buffer to Cloudinary
        uploadStream.end(file.buffer);
      });

      // Return secure URL so the frontend can use it directly
      return result?.secure_url || result?.url;
    } catch (error) {
      throw new Error('Image upload failed: ' + error.message);
    }
  });

  // Wait for all images to finish uploading
  const uploadedUrls = await Promise.all(uploadImages);

  // Remove any empty values and return the URLs
  return uploadedUrls.filter(Boolean);
};
