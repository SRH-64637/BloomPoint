// models/User.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

export type UserRole = "USER" | "EMPLOYER" | "ADMIN";

export interface IUser extends Document {
  clerkId: string; // Clerk user ID
  email?: string; // Optional, since Clerk manages it
  name?: string;
  role: UserRole;
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
  },
  { timestamps: true }
);

export const User =
  (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
