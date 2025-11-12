// src/models/mongoose/user.model.ts
import { Schema, model, Model, Types, Document } from "mongoose";
import { IUserEntity, UserRole } from "../user.model.interface";

/**
 * MongoDB-specific user interface
 */
export interface IUserMongo
  extends Omit<IUserEntity, "id" | "followers" | "following">,
  Document {
  _id: Types.ObjectId;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

const userSchema = new Schema<IUserMongo>(
  {
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    fullName: { type: String, required: true },
    avatar: { type: String, default: null },
    bio: { type: String, maxlength: 500, default: "" },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      twitter: { type: String, default: null },
      linkedin: { type: String, default: null },
      github: { type: String, default: null },
      website: { type: String, default: null },
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String, default: null },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      marketingUpdates: { type: Boolean, default: false },
      twoFactorAuth: { type: Boolean, default: false },
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User: Model<IUserMongo> = model<IUserMongo>("User", userSchema);
