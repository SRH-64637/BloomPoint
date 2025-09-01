// models/User.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

export type UserRole = "USER" | "EMPLOYER" | "ADMIN";

export interface IUser extends Document {
  clerkId: string; // Clerk user ID
  email?: string; // Optional, since Clerk manages it
  name?: string;
  role: UserRole;
  xp?: number; // gamification points
  savedJobs?: Schema.Types.ObjectId[]; // refs to Jobs
  savedCourses?: Schema.Types.ObjectId[]; // refs to Courses
  progress?: {
    courses?: { [courseId: string]: number }; // courseId: progress percentage
    jobs?: { [jobId: string]: string }; // jobId: status
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // main link to Clerk
    email: { type: String }, // not required, just for convenience
    name: { type: String },
    role: {
      type: String,
      enum: ["USER", "EMPLOYER", "ADMIN"],
      default: "USER",
    },
    xp: { type: Number, default: 0 },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    savedCourses: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
    progress: {
      courses: { type: Map, of: Number, default: {} },
      jobs: { type: Map, of: String, default: {} },
    },
  },
  { timestamps: true }
);

export const User =
  (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
