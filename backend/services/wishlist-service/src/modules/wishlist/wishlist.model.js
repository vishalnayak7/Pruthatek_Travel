import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }

}, { timestamps: true });

// Prevent duplicate wishlist name for same user
wishlistSchema.index({ userId: 1, name: 1 }, { unique: true });

export const WISHLIST_MODEL= mongoose.model("wishlist", wishlistSchema);