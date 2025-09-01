import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";
import { Job } from "@/model/Job.models";
import { Resource } from "@/model/Resource.models";

// Check if user is the creator of a resource
export async function checkResourcePermissions(
  resourceId: string,
  resourceType: "job" | "course" | "blog"
): Promise<{ canEdit: boolean; canDelete: boolean; canRead: boolean }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { canEdit: false, canDelete: false, canRead: true };
    }

    await dbConnect();

    let resource;
    let creatorField: string;

    switch (resourceType) {
      case "job":
        resource = await Job.findById(resourceId);
        creatorField = "createdBy";
        break;
      case "course":
      case "blog":
        resource = await Resource.findById(resourceId);
        creatorField = "createdBy";
        break;
      default:
        return { canEdit: false, canDelete: false, canRead: true };
    }

    if (!resource) {
      return { canEdit: false, canDelete: false, canRead: false };
    }

    // Check if user is the creator
    const isCreator = resource[creatorField]?.toString() === userId;

    // Check if user is admin
    const user = await User.findOne({ clerkId: userId });
    const isAdmin = user?.role === "ADMIN";

    return {
      canEdit: isCreator || isAdmin,
      canDelete: isCreator || isAdmin,
      canRead: true, // Everyone can read
    };
  } catch (error) {
    console.error("Error checking resource permissions:", error);
    return { canEdit: false, canDelete: false, canRead: true };
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Check if user is employer
export async function isEmployer(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    return user?.role === "EMPLOYER";
  } catch (error) {
    console.error("Error checking employer status:", error);
    return false;
  }
}

// Check if user can create resources
export async function canCreateResource(
  resourceType: "job" | "course" | "blog"
): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    switch (resourceType) {
      case "job":
        return user?.role === "EMPLOYER" || user?.role === "ADMIN";
      case "course":
      case "blog":
        return true; // Any authenticated user can create courses/blogs
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking create permissions:", error);
    return false;
  }
}
