import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCLoudinary = async (url: string) => {
  try {
    if (!url) return;
    const parts = url.split("/");
    const filename = parts[parts.length - 1] || "";
    const publicId = filename.split(".")[0];
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // ignore cleanup errors
  }
};

export default cloudinary;
