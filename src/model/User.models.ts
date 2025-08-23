// models/User.ts
import { Schema, model, models, Document } from "mongoose";

export type UserRole = "USER" | "EMPLOYER" | "ADMIN";

export interface IUser extends Document {
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "EMPLOYER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

export const User = models.User<IUser> || model<IUser>("User", UserSchema);
