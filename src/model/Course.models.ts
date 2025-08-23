// models/Course.ts
import { Schema, model, models, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description?: string;
  category?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  createdBy: Schema.Types.ObjectId; // Employer
  projects: Schema.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

export const Course = models.Course || model<ICourse>("Course", CourseSchema);

//
// CERTIFICATION
//
export interface ICertification extends Document {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  issuedAt: Date;
  verified: boolean;
}

const CertificationSchema = new Schema<ICertification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    issuedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Certification =
  models.Certification ||
  model<ICertification>("Certification", CertificationSchema);
