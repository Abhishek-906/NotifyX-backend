import mongoose, { Mongoose } from "mongoose";

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
      ref: 'User'
    },
    password: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: String
    }
  },
  { timestamps: true },
);

export const User = mongoose.model("Users", userSchema);
