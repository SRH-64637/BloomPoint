// src/app/api/me/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        
        // Safely extract email
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        
        // Safely construct name
        const firstName = clerkUser.firstName || "";
        const lastName = clerkUser.lastName || "";
        const name = `${firstName} ${lastName}`.trim() || "Unknown User";
        
        mongoUser = await User.create({
          clerkId: userId,
          name: name,
          email: email,
          role: "USER",
        });
      } catch (clerkError) {
        console.error("Failed to fetch user from Clerk:", clerkError);
        return NextResponse.json(
          { error: "Failed to fetch user information" }, 
          { status: 500 }
        );
      }
    }

    return NextResponse.json(mongoUser);
    
  } catch (error) {
    console.error("Unexpected error in /api/me:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}