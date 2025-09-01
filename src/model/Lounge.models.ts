import { Schema, model, models, Document, Types } from "mongoose";

export interface ILoungePost extends Document {
  userId: string; // Clerk user id
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: Array<{
    userId: string;
    type: "like" | "support" | "love" | "laugh";
  }>;
  commentCount: number;
}

export interface ILoungeComment extends Document {
  postId: Types.ObjectId; // ref to LoungePosts
  userId: string; // Clerk user id
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema({
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ["like", "support", "love", "laugh"],
    required: true,
  },
});

const LoungePostSchema = new Schema<ILoungePost>(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true, maxlength: 1000 },
    imageUrl: String,
    videoUrl: String,
    reactions: [ReactionSchema],
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const LoungeCommentSchema = new Schema<ILoungeComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "LoungePost", required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Indexes for better performance
LoungePostSchema.index({ createdAt: -1 });
LoungePostSchema.index({ userId: 1 });
LoungeCommentSchema.index({ postId: 1 });
LoungeCommentSchema.index({ createdAt: -1 });

export const LoungePost =
  models.LoungePost || model<ILoungePost>("LoungePost", LoungePostSchema);
export const LoungeComment =
  models.LoungeComment ||
  model<ILoungeComment>("LoungeComment", LoungeCommentSchema);
