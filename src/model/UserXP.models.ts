// models/UserXP.ts
import { Schema, model, models, Document } from "mongoose";

export interface IUserXP extends Document {
  userId: Schema.Types.ObjectId;
  xp: number;
  level: number;
}

const UserXPSchema = new Schema<IUserXP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const UserXP = models.UserXP || model<IUserXP>("UserXP", UserXPSchema);
