import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { LoungePost } from "@/model/Lounge.models";

// POST: Add or update a reaction to a post
export async function POST(request: Request) {
  try {
    const { postId, userId, reactionType } = await request.json();

    if (!postId || !userId || !reactionType) {
      return NextResponse.json(
        { error: "Post ID, user ID, and reaction type are required" },
        { status: 400 }
      );
    }

    if (!["like", "support", "love", "laugh"].includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Remove existing reaction from this user if it exists
    await LoungePost.findByIdAndUpdate(postId, {
      $pull: { reactions: { userId } },
    });

    // Add new reaction
    await LoungePost.findByIdAndUpdate(postId, {
      $push: { reactions: { userId, type: reactionType } },
    });

    return NextResponse.json({
      message: "Reaction updated successfully",
      reactionType,
    });
  } catch (error) {
    console.error("Error updating reaction:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}