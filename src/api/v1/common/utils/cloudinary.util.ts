import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { env } from "../../../../app/config/env";
import logger from "../../../../app/utils/logger";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and deletes the local file after upload
 * @param localFilePath - Path to the local file
 * @returns Cloudinary upload response or null on failure
 */
export const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  if (!localFilePath) {
    logger.warn("No file path provided for Cloudinary upload");
    return null;
  }

  try {
    logger.info(`Uploading to Cloudinary: ${localFilePath}`);

    const response: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );

    logger.info(`✅ File uploaded successfully: ${response.secure_url}`);

    // Delete local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      logger.debug(`Deleted local file: ${localFilePath}`);
    }

    return response;
  } catch (error: any) {
    logger.error(`❌ Cloudinary upload failed: ${error.message}`);

    // Attempt to delete local file even on failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      logger.debug(`Deleted local file after failed upload: ${localFilePath}`);
    }

    return null;
  }
};
