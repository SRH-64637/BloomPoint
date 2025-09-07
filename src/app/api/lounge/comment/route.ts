import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { LoungeComment } from "@/model/Lounge.models";
import { LoungePost } from "@/model/Lounge.models";

// POST: Add a comment to a post
export async function POST(request: Request) {
  try {
    const { postId, userId, content } = await request.json();

    if (!postId || !userId || !content) {
      return NextResponse.json(
        { error: "Post ID, user ID, and content are required" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Comment must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await LoungeComment.create({
      postId,
      userId,
      content,
    });

    // Update the post's comment count
    await LoungePost.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}