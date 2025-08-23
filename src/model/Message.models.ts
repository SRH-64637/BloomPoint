import { Schema, model, models, Document } from "mongoose";

export interface ICommunityChannel extends Document {
  name: string;
  description?: string;
  type: "GENERAL" | "SUPPORT" | "PROJECT" | "EVENT";
}

const CommunityChannelSchema = new Schema<ICommunityChannel>(
  {
    name: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ["GENERAL", "SUPPORT", "PROJECT", "EVENT"],
      default: "GENERAL",
    },
  },
  { timestamps: true }
);

export const CommunityChannel =
  models.CommunityChannel ||
  model<ICommunityChannel>("CommunityChannel", CommunityChannelSchema);

export interface IMessage extends Document {
  channelId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  content: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityChannel",
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message =
  models.Message || model<IMessage>("Message", MessageSchema);
