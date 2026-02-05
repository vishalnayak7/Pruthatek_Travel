import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER"},

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    
  },
  { timestamps: true });

export const USER_MODEL = mongoose.model("user", userSchema);
