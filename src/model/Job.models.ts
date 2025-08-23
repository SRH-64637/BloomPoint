// models/Job.ts
import { Schema, model, models, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  employerId: Schema.Types.ObjectId;
  skillsRequired: string[];
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skillsRequired: [String],
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },
  },
  { timestamps: true }
);

export const Job = models.Job || model<IJob>("Job", JobSchema);

//
// JOB APPLICATION
//
export interface IJobApplication extends Document {
  jobId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const JobApplication =
  models.JobApplication ||
  model<IJobApplication>("JobApplication", JobApplicationSchema);
