import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

//checl and load env variables
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return uploadResponse;
  } catch (error) {
    throw new Error(`Media upload failed: ${error.message}`);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    throw new Error(`Media deletion failed: ${error.message}`);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    return result;
  } catch (error) {
    throw new Error(`Video deletion failed: ${error.message}`);
  }
};


export default cloudinary;