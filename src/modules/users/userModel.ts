import mongoose from "mongoose";


interface IUser {
  fullName: string,
  role: "SUPERADMIN" | "ADMIN" | "USER",
  email: string,
  parentId: mongoose.Types.ObjectId | null,
  password: string,
  lastSeen?: Date,
  isBlocked: boolean,
  blockedBy: mongoose.Types.ObjectId | null,
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "USER"],
      default: "USER",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      default: null
    },
    password: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
