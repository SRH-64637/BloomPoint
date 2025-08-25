// models/WellnessLog.models.ts

import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IWellnessLog extends Document {
  userId: string;
  entry: string;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessLogSchema = new Schema<IWellnessLog>(
  {
    userId: { type: String, required: true },
    entry: { type: String, required: true },
  },
  { timestamps: true }
);

export const WellnessLog =
  models.WellnessLog || model<IWellnessLog>("WellnessLog", WellnessLogSchema);