// app/api/resources/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Resource } from "@/model/Resource.models";
import { auth } from "@clerk/nextjs/server";

// Add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Get single resource
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const resource = await Resource.findById(id).lean();

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ resource }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT/PATCH - Update resource
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if resource exists and user owns it
    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (existingResource.createdBy.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this resource" },
        { status: 403, headers: corsHeaders }
      );
    }

    const updates = await request.json();

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;

    const resource = await Resource.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { message: "Resource updated successfully", resource },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error updating resource:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Delete resource
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if resource exists and user owns it
    const resource = await Resource.findById(id);
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (resource.createdBy.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this resource" },
        { status: 403, headers: corsHeaders }
      );
    }

    await Resource.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500, headers: corsHeaders }
    );
  }
}
