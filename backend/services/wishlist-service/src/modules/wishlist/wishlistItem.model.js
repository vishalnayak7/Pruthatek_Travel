import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  wishlistId: { type: mongoose.Schema.Types.ObjectId, required: true },
  entityId: { type: String, required: true },
  entityType: { type: String, enum: ["hotel", "flight"], required: true }

}, { timestamps: true });

wishlistItemSchema.index({ wishlistId: 1, entityId: 1 }, { unique: true });


export const WISHLISTITEM_MODEL= mongoose.model("wishlistItem", wishlistItemSchema);