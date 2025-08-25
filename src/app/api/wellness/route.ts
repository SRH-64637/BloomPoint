import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { WellnessLog } from "@/model/WellnessLog.models";
import { auth } from "@clerk/nextjs/server";

// GET: fetch all logs for this user
export async function GET() {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await WellnessLog.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching wellness logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch wellness logs" },
      { status: 500 }
    );
  }
}

// POST: create a new log
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entry } = await req.json();

    if (!entry || typeof entry !== "string") {
      return NextResponse.json(
        { error: "Valid entry required" },
        { status: 400 }
      );
    }

    if (entry.trim().length === 0) {
      return NextResponse.json(
        { error: "Entry cannot be empty" },
        { status: 400 }
      );
    }

    const wellnessLog = await WellnessLog.create({
      userId,
      entry: entry.trim(),
    });

    return NextResponse.json(
      {
        message: "Wellness log saved successfully",
        wellnessLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating wellness log:", error);
    return NextResponse.json(
      { error: "Failed to save wellness log" },
      { status: 500 }
    );
  }
}

// DELETE: delete a log owned by the current user
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Log id required" }, { status: 400 });
    }

    const log = await WellnessLog.findById(id);
    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    if (log.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await WellnessLog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Log deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting wellness log:", error);
    return NextResponse.json(
      { error: "Failed to delete wellness log" },
      { status: 500 }
    );
  }
}
