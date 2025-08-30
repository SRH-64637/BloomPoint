import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'lecture-videos';

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with upload preset
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          resource_type: 'video',
          folder: folder,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // ADD THIS
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}