import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  password: { type: String, select: false },

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  emailOtpHash: String,
  phoneOtpHash: String,

  otpExpiry: Date,

  status: {
    type: String,
    enum: ["PENDING_VERIFICATION", "OTP_VERIFIED", "ACTIVE"],
    default: "PENDING_VERIFICATION"
  }
}, { timestamps: true });

export const USER_MODEL = mongoose.model("user", userSchema);