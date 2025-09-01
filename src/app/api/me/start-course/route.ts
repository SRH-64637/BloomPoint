import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { UserXP } from "@/model/UserXP.models";

// POST: Award XP for starting a course
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Award XP for starting a course
    const xpToAdd = 25; // +25 XP for starting a course

    // Update UserXP model
    let userXP = await UserXP.findOne({ clerkId: userId });
    if (!userXP) {
      userXP = await UserXP.create({ clerkId: userId, xp: xpToAdd });
    } else {
      userXP.xp += xpToAdd;
      await userXP.save();
    }

    // Update User model
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { xp: xpToAdd } },
      { upsert: true }
    );

    // Calculate new level and progress
    const newLevel = Math.floor(userXP.xp / 100) + 1;
    const xpInCurrentLevel = userXP.xp % 100;
    const xpToNextLevel = 100 - xpInCurrentLevel;
    const xpProgress = (xpInCurrentLevel / 100) * 100;

    return NextResponse.json({
      message: "Course started! +25 XP earned",
      xp: userXP.xp,
      level: newLevel,
      xpToNextLevel,
      xpProgress,
      xpGained: xpToAdd,
    });
  } catch (error) {
    console.error("Error starting course:", error);
    return NextResponse.json(
      { error: "Failed to start course" },
      { status: 500 }
    );
  }
}
