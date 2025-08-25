import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Job } from "@/model/Job.models";
import { User } from "@/model/User.models";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch all jobs with optional filtering
export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const skills = searchParams.get("skills")?.split(",") || [];
    const level = searchParams.get("level") || "";
    const type = searchParams.get("type") || "";
    const remote = searchParams.get("remote") || "";

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (skills.length > 0 && skills[0] !== "") {
      filter.skillsRequired = { $in: skills };
    }

    if (level) {
      filter.level = level;
    }

    if (type) {
      filter.type = type;
    }

    if (remote === "true") {
      filter.remote = true;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST: Create a new job posting

// export async function POST(request: Request) {
//   try {
//     await dbConnect();

//     // Get authentication from Clerk
//     const { userId } = await auth();

//     console.log("Clerk User ID:", userId);

//     if (!userId) {
//       return NextResponse.json(
//         { error: "Unauthorized. Please log in to create a job." },
//         { status: 401 }
//       );
//     }

//     const {
//       title,
//       description,
//       skillsRequired,
//       level,
//       location,
//       salary,
//       type,
//       remote,
//       company,
//     } = await request.json();

//     if (!title || !description) {
//       return NextResponse.json(
//         { error: "Title and description are required" },
//         { status: 400 }
//       );
//     }

//     // Create job with Clerk user ID as string
//     const job = await Job.create({
//       title,
//       description,
//       skillsRequired: skillsRequired || [],
//       level: level || "BEGINNER",
//       location: location || "",
//       salary: salary || "",
//       type: type || "FULL_TIME",
//       remote: remote || false,
//       company: company || "",
//       employerId: userId, // This is the Clerk user ID string
//     });

//     return NextResponse.json(
//       { message: "Job created successfully", job },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating job:", error);
//     return NextResponse.json(
//       { error: "Failed to create job" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    console.log("=== JOB CREATION STARTED ===");
    await dbConnect();
    console.log("Database connected");

    // Get authentication from Clerk
    const { userId } = await auth();
    console.log("Clerk User ID:", userId);

    if (!userId) {
      console.error("No user ID found - unauthorized");
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create a job." },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    console.log("Request body:", requestBody);

    const {
      title,
      description,
      skillsRequired,
      level,
      location,
      salary,
      type,
      remote,
      company,
    } = requestBody;

    // Validate required fields
    if (!title || !title.trim()) {
      console.error("Title validation failed");
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      console.error("Description validation failed");
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Resolve employer (Mongo user) from Clerk userId
    let employer = await User.findOne({ clerkId: userId });
    if (!employer) {
      employer = await User.create({ clerkId: userId });
    }

    console.log("Creating job with data:", {
      title: title.trim(),
      description: `${description.trim().substring(0, 50)}...`,
      skillsRequired,
      level,
      location,
      salary,
      type,
      remote,
      company,
      employerId: employer._id,
    });

    // Create the job
    const jobData = {
      title: title.trim(),
      description: description.trim(),
      skillsRequired: skillsRequired || [],
      level: level || "BEGINNER",
      location: location || "",
      salary: salary || "",
      type: type || "FULL_TIME",
      remote: remote || false,
      company: company || "",
      employerId: employer._id,
    };

    console.log("Final job data for creation:", jobData);

    const job = await Job.create(jobData);
    console.log("Job created successfully:", job._id);

    return NextResponse.json(
      {
        message: "Job created successfully",
        jobId: job._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("=== JOB CREATION ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // MongoDB validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", errors);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // MongoDB duplicate key errors
    if (error.code === 11000) {
      console.error("Duplicate key error:", error);
      return NextResponse.json({ error: "Duplicate entry" }, { status: 400 });
    }

    // Generic error
    console.error("Unknown error:", error);
    return NextResponse.json(
      {
        error: "Failed to create job",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Update Job
export async function PATCH(req: Request) {
  await dbConnect();
  const { id, ...data } = await req.json();
  try {
    const job = await Job.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(job, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// Delete Job
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Job id required" }, { status: 400 });
  try {
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
