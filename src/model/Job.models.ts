import { Schema, model, models, Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  employerId: string;
  skillsRequired: string[];
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  location?: string;
  salary?: string;
  type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  remote?: boolean;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    employerId: { type: String, required: true },
    skillsRequired: [String],
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },
    location: String,
    salary: String,
    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      default: "FULL_TIME"
    },
    remote: { type: Boolean, default: false },
    company: String
  },
  { timestamps: true }
);

export const Job = models.Job || model<IJob>("Job", JobSchema);

// 
//
// JOB APPLICATION
//
export interface IJobApplication extends Document {
  jobId: Types.ObjectId;
  userId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  coverLetter?: string;
  resume?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: String, required: true},
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    coverLetter: String,
    resume: String,
  },
  { timestamps: true }
);

export const JobApplication =
  models.JobApplication ||
  model<IJobApplication>("JobApplication", JobApplicationSchema);
