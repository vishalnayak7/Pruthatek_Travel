import mongoose from "mongoose";

const logoutTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Automatically delete expired tokens
logoutTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LOGOUT_TOKEN_MODEL = mongoose.model("logoutToken", logoutTokenSchema);