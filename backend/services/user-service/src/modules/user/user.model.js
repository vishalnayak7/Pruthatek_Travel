import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },

  password: { type: String, select: false },

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  emailOtpHash: String,
  phoneOtpHash: String,

  otpExpiry: Date,

  resetPhoneOtpHash: String,
  resetPhoneOtpExpiry: Date,

  status: {
    type: String,
    enum: ["PENDING_VERIFICATION", "OTP_VERIFIED", "ACTIVE"],
    default: "PENDING_VERIFICATION"
  },

  googleId: { type: String, unique: true, sparse: true }, 
  provider: { type: String, enum: ["local", "google"], default: "local" }, 

}, { timestamps: true });

export const USER_MODEL = mongoose.model("user", userSchema);