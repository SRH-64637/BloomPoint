// src/app/api/users/role/route.ts
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { userId } =  await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const body = await req.json();
  const { targetClerkId, newRole } = body; 


  const requester = await User.findOne({ clerkId: userId });
  if (!requester || requester.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }


  const targetUser = await User.findOne({ clerkId: targetClerkId });
  if (!targetUser) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  targetUser.role = newRole;
  await targetUser.save();

  return NextResponse.json({ message: "Role updated", user: targetUser });
}
