import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Job } from "@/model/Job.models";
import { User } from "@/model/User.models";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch a single job by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const job = await Job.findById(id).populate(
      "employerId",
      "firstName lastName email company"
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT: Update a job
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Resolve current Mongo user by Clerk ID
    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns this job
    if (job.employerId.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to update this job" },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("employerId", "firstName lastName email");

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Resolve current Mongo user by Clerk ID
    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns this job
    if (job.employerId.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to delete this job" },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
