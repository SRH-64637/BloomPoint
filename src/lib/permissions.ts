import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.models";

export interface PermissionCheck {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  isOwner: boolean;
}

/**
 * Check if the current user can edit/delete a resource
 * @param resourceCreatedBy - The ID of the user who created the resource
 * @returns PermissionCheck object with boolean flags
 */
export async function checkResourcePermissions(
  resourceCreatedBy: string | any
): Promise<PermissionCheck> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        canEdit: false,
        canDelete: false,
        canView: true, // Anyone can view
        isOwner: false,
      };
    }

    await dbConnect();

    // Get current user from our database
    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return {
        canEdit: false,
        canDelete: false,
        canView: true,
        isOwner: false,
      };
    }

    // Check if current user is the owner
    const isOwner = (currentUser._id as string).toString() === resourceCreatedBy.toString();

    return {
      canEdit: isOwner,
      canDelete: isOwner,
      canView: true, // Anyone can view
      isOwner,
    };
  } catch (error) {
    console.error("Error checking permissions:", error);
    return {
      canEdit: false,
      canDelete: false,
      canView: true,
      isOwner: false,
    };
  }
}

/**
 * Check if the current user is an admin
 * @returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    await dbConnect();

    const currentUser = await User.findOne({ clerkId: userId });
    return currentUser?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Check if the current user is an employer
 * @returns boolean
 */
export async function isEmployer(): Promise<boolean> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    await dbConnect();

    const currentUser = await User.findOne({ clerkId: userId });
    return currentUser?.role === "EMPLOYER";
  } catch (error) {
    console.error("Error checking employer status:", error);
    return false;
  }
}
