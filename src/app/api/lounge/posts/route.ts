import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { LoungePost } from "@/model/Lounge.models";

// GET: Fetch all lounge posts
export async function GET() {
  try {
    await dbConnect();

    const posts = await LoungePost.find().sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching lounge posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST: Create a new lounge post
export async function POST(request: Request) {
  try {
    const { userId, content, imageUrl, videoUrl } = await request.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: "User ID and content are required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Content must be less than 1000 characters" },
        { status: 400 }
      );
    }

    const post = await LoungePost.create({
      userId,
      content,
      imageUrl,
      videoUrl,
      reactions: [],
      commentCount: 0,
    });

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lounge post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}