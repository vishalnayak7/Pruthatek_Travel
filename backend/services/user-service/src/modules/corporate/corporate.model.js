import mongoose from "mongoose";

const corporateSchema = new mongoose.Schema({
  fullName: { type: String },
  mobile: { type: String, unique: true },

  roleInCompany: { type: String },
  companyName: { type: String },
  employeeSize: { type: String },
  gstNumber: { type: String },

  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },

  emailVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  
  emailOtpHash: String,
  otpExpiry: Date,

  resetEmailOtpHash: String,
  resetEmailOtpExpiry: Date,

  status: {
    type: String,
    enum: ["PENDING_VERIFICATION", "OTP_VERIFIED", "ACTIVE"],
    default: "PENDING_VERIFICATION"
  }
}, { timestamps: true });


export const CORPORATE_MODEL = mongoose.model("corporate", corporateSchema);