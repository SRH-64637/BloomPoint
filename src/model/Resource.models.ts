// models/Resource.models.ts
import { Schema, model, models, Document, Types } from "mongoose";

export type ResourceType = "course" | "blog" | "video" | "multi-video-course";
export type VideoType = "youtube" | "vimeo" | "embed" | "file";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface IVideoLecture {
  title: string;
  description?: string;
  videoUrl: string;
  videoType: VideoType;
  duration?: number; // in minutes
  thumbnail?: string;
  order: number;
  isPreview?: boolean;
}

export interface IResource extends Document {
  title: string;
  description: string;
  content: string; // Markdown for blogs, URL for courses, video URL for videos
  type: ResourceType;
  videoType?: VideoType; // Only for video resources
  tags: string[];
  thumbnail?: string;
  featured: boolean;

  // For multi-video courses
  videoLectures?: IVideoLecture[];
  totalDuration?: number;
  lectureCount?: number;

  // Learning metadata
  difficulty?: DifficultyLevel;
  duration?: number; // in minutes
  progress?: number; // 0-100 for user progress tracking

  // References
  createdBy: string; // Clerk user ID

  // Engagement metrics
  views: number;
  likes: number;
  bookmarks: number;
  rating?: number; // Average rating 1-5

  createdAt: Date;
  updatedAt: Date;
}

const VideoLectureSchema = new Schema<IVideoLecture>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  videoType: {
    type: String,
    enum: ["youtube", "vimeo", "embed", "file"],
    required: true,
  },
  duration: {
    type: Number,
    min: 0,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
});

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["course", "blog", "video", "multi-video-course"],
      required: true,
    },
    videoType: {
      type: String,
      enum: ["youtube", "vimeo", "embed", "file"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    thumbnail: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Multi-video course fields
    videoLectures: [VideoLectureSchema],
    totalDuration: {
      type: Number,
      min: 0,
    },
    lectureCount: {
      type: Number,
      min: 0,
    },

    // Learning metadata
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: {
      type: Number, // in minutes
      min: 0,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // References
    createdBy: {
      type: String, // Clerk user ID
      required: true,
    },

    // Engagement metrics
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Update total duration and lecture count before saving
ResourceSchema.pre("save", function (next) {
  if (this.type === "multi-video-course" && this.videoLectures) {
    this.lectureCount = this.videoLectures.length;
    this.totalDuration = this.videoLectures.reduce(
      (total, lecture) => total + (lecture.duration || 0),
      0
    );
  }
  next();
});

// Virtual for formatted duration
ResourceSchema.virtual("formattedDuration").get(function () {
  if (this.totalDuration) {
    const hours = Math.floor(this.totalDuration / 60);
    const minutes = this.totalDuration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  if (this.duration) {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  return null;
});

// Indexes for better query performance
ResourceSchema.index({ type: 1, createdAt: -1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ featured: 1, createdAt: -1 });
ResourceSchema.index({ createdBy: 1 });
ResourceSchema.index({ difficulty: 1 });
ResourceSchema.index({ "videoLectures.order": 1 });

// Static methods
ResourceSchema.statics.findByType = function (type: ResourceType) {
  return this.find({ type }).sort({ createdAt: -1 });
};

ResourceSchema.statics.findFeatured = function () {
  return this.find({ featured: true }).sort({ createdAt: -1 });
};

ResourceSchema.statics.search = function (query: string) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  });
};

export const Resource =
  models.Resource || model<IResource>("Resource", ResourceSchema);
