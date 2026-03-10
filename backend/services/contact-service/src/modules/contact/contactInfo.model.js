import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
phone: { type: String },
whatsapp: { type: String },
email: { type: String },
location: { type: String },
openingTime: { type: String },

}, { timestamps: true });

export default mongoose.model("ContactInfo", contactInfoSchema);