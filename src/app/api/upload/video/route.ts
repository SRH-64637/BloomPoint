import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import {
  FILE_SIZE_LIMITS,
  SUPPORTED_VIDEO_FORMATS,
  getFileValidationError,
} from "@/lib/utils";

// Configure Cloudinary - Make sure you have these in your .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Add authentication check
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "lecture-videos";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file using utility functions
    const validationError = getFileValidationError(
      file,
      FILE_SIZE_LIMITS.VIDEO,
      SUPPORTED_VIDEO_FORMATS
    );
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary with optimized settings for large files
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          resource_type: "video",
          folder: folder,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          chunk_size: 10000000, // Increased chunk size to 10MB for better large file handling
          eager: [
            { quality: "auto", format: "mp4" }, // Optimize video format
            { quality: "auto", format: "webm" }, // WebM for better web compatibility
          ],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_WEBHOOK_URL, // Optional: for notifications
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return NextResponse.json({
      success: true,
      result,
      fileSize: file.size,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
