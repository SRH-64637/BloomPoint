import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { Job } from "@/model/Job.models";
import { Resource } from "@/model/Resource.models";

// GET: Get user's saved jobs and courses
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

    // For now, we'll return empty arrays since we haven't implemented the save functionality yet
    // This is a placeholder that can be expanded later with actual save/bookmark functionality
    const savedJobs: any[] = [];
    const savedCourses: any[] = [];

    return NextResponse.json({
      savedJobs,
      savedCourses,
      totalSaved: savedJobs.length + savedCourses.length,
    });
  } catch (error) {
    console.error("Error fetching saved items:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved items" },
      { status: 500 }
    );
  }
}

// POST: Save a job or course (placeholder for future implementation)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, itemType } = await request.json();

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: "Item ID and type are required" },
        { status: 400 }
      );
    }

    // This is a placeholder - actual save functionality would be implemented here
    // For now, just return success
    return NextResponse.json({
      message: "Item saved successfully",
      itemId,
      itemType,
    });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}
