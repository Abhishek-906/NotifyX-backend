import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "USER"],
      require: true,
      default: "USER",
    },
    email: {
      type: String,
      require: true,
      unique: true, 
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("UserIsThis", userSchema);
