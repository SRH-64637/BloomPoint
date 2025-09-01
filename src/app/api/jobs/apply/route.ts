import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { JobApplication } from "@/model/Job.models";
import { User } from "@/model/User.models";
import { auth } from "@clerk/nextjs/server";

// POST: Apply for a job
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Resolve applicant (Mongo user) from Clerk userId
    let applicant = await User.findOne({ clerkId: userId });
    if (!applicant) {
      applicant = await User.create({ clerkId: userId });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId: applicant._id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 400 }
      );
    }

    const application = await JobApplication.create({
      jobId,
      userId: applicant._id,
      coverLetter,
      status: "PENDING",
    });

    // Add XP for applying to a job
    try {
      const xpResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/me/xp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 50, // 50 XP for applying to a job
            action: "job_application",
          }),
        }
      );

      if (xpResponse.ok) {
        const xpData = await xpResponse.json();
        console.log("XP added for job application:", xpData);
      }
    } catch (xpError) {
      console.error("Failed to add XP for job application:", xpError);
      // Don't fail the job application if XP addition fails
    }

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { error: "Failed to apply for job" },
      { status: 500 }
    );
  }
}

// GET: Get user's job applications
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await JobApplication.find({ userId })
      .populate({
        path: "jobId",
        populate: {
          path: "employerId",
          select: "firstName lastName company",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
