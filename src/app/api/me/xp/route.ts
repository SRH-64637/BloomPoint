import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { UserXP } from "@/model/UserXP.models";

// GET: Get user's current XP and level
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get or create user
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create user XP record
    let userXP = await UserXP.findOne({ userId: user._id });
    if (!userXP) {
      userXP = await UserXP.create({
        userId: user._id,
        xp: 0,
        level: 1,
      });
    }

    // Calculate XP needed for next level
    const xpToNextLevel = userXP.level * 100;
    const xpProgress = (userXP.xp / xpToNextLevel) * 100;

    return NextResponse.json({
      xp: userXP.xp,
      level: userXP.level,
      totalXP: userXP.xp + (userXP.level - 1) * 100, // Total XP earned
      xpToNextLevel,
      xpProgress,
    });
  } catch (error) {
    console.error("Error fetching user XP:", error);
    return NextResponse.json(
      { error: "Failed to fetch user XP" },
      { status: 500 }
    );
  }
}

// POST: Add XP to user (for actions like applying to jobs, starting courses)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, action } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Valid XP amount is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get or create user
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create user XP record
    let userXP = await UserXP.findOne({ userId: user._id });
    if (!userXP) {
      userXP = await UserXP.create({
        userId: user._id,
        xp: 0,
        level: 1,
      });
    }

    // Add XP
    const newXP = userXP.xp + amount;
    let newLevel = userXP.level;
    let leveledUp = false;

    // Check if user leveled up
    const xpNeededForCurrentLevel = userXP.level * 100;
    if (newXP >= xpNeededForCurrentLevel) {
      newLevel += 1;
      leveledUp = true;
    }

    // Update user XP
    userXP.xp = newXP;
    userXP.level = newLevel;
    await userXP.save();

    // Calculate new XP needed for next level
    const xpToNextLevel = newLevel * 100;
    const xpProgress = (newXP / xpToNextLevel) * 100;

    return NextResponse.json({
      message: "XP added successfully",
      xp: newXP,
      level: newLevel,
      totalXP: newXP + (newLevel - 1) * 100,
      xpToNextLevel,
      xpProgress,
      leveledUp,
      action,
      amountAdded: amount,
    });
  } catch (error) {
    console.error("Error adding XP:", error);
    return NextResponse.json({ error: "Failed to add XP" }, { status: 500 });
  }
}
