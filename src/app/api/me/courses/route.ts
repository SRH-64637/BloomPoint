import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { Resource } from "@/model/Resource.models";

// GET: Get courses created by the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get courses created by the user
    const courses = await Resource.find({
      createdBy: user._id,
      type: { $in: ["course", "multi-video-course", "video"] },
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    return NextResponse.json({
      courses,
      total: courses.length,
    });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch user courses" },
      { status: 500 }
    );
  }
}
