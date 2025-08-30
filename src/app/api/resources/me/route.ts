// app/api/resources/me/route.ts
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

// GET - Get current user's resources
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Build filter object
    const filter: any = { createdBy: userId };
    if (type) {
      filter.type = type;
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
    console.error("Error fetching user resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500, headers: corsHeaders }
    );
  }
}
