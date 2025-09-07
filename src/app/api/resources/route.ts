// app/api/resources/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Resource } from "@/model/Resource.models";
import { auth } from "@clerk/nextjs/server";

// Add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const typesParam = searchParams.get("types"); // comma-separated list
    const typeList = [
      ...searchParams.getAll("type"),
      ...(typesParam ? typesParam.split(",").map((t) => t.trim()) : []),
    ].filter(Boolean);
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const difficulty = searchParams.get("difficulty");
    const duration = searchParams.get("duration");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Build filter object
    const filter: any = {};

    if (typeList.length > 0) {
      filter.type = { $in: typeList };
    } else if (type) {
      filter.type = type;
    }
    if (tag) filter.tags = { $in: [tag] };
    if (featured === "true") filter.featured = true;
    if (difficulty) filter.difficulty = difficulty;

    // Duration filter (e.g., duration=short, medium, long)
    if (duration) {
      switch (duration) {
        case "short":
          filter.duration = { $lte: 30 };
          break;
        case "medium":
          filter.duration = { $gt: 30, $lte: 60 };
          break;
        case "long":
          filter.duration = { $gt: 60 };
          break;
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (page - 1) * limit;
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(filter);

    return NextResponse.json(
      {
        resources,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Add authentication check
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check content type and parse request body
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400, headers: corsHeaders }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      title,
      description,
      content,
      type,
      videoType,
      tags,
      thumbnail,
      featured,
      difficulty,
      duration,
      videoLectures,
    } = body;

    // Validate required fields
    if (!title || !description || !content || !type) {
      return NextResponse.json(
        { error: "Title, description, content, and type are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate videoType for video resources
    if (type === "video" && !videoType) {
      return NextResponse.json(
        { error: "videoType is required for video resources" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate videoLectures for multi-video courses
    if (type === "multi-video-course") {
      if (
        !videoLectures ||
        !Array.isArray(videoLectures) ||
        videoLectures.length === 0
      ) {
        return NextResponse.json(
          { error: "videoLectures array is required for multi-video courses" },
          { status: 400, headers: corsHeaders }
        );
      }

      // Validate each lecture
      for (let i = 0; i < videoLectures.length; i++) {
        const lecture = videoLectures[i];
        if (!lecture.title || !lecture.videoUrl || !lecture.videoType) {
          return NextResponse.json(
            {
              error: `Lecture ${
                i + 1
              } is missing required fields (title, videoUrl, videoType)`,
            },
            { status: 400, headers: corsHeaders }
          );
        }
        // Set order if not provided
        if (lecture.order === undefined) {
          lecture.order = i;
        }
      }
    }

    const resource = await Resource.create({
      title,
      description,
      content,
      type,
      videoType: type === "video" ? videoType : undefined,
      tags: tags || [],
      thumbnail,
      featured: featured || false,
      difficulty,
      duration,
      videoLectures: type === "multi-video-course" ? videoLectures : undefined,
      createdBy: userId, // Clerk user ID as string
    });

    return NextResponse.json(
      { message: "Resource created successfully", resource },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error creating resource:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Resource with this title already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${errors.join(", ")}` },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500, headers: corsHeaders }
    );
  }
}
