import mongoose from "mongoose";

const coTravellerSchema = new mongoose.Schema(
{
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },

  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },

  gender: { type: String },
  nationality: { type: String },
  relation: { type: String },

  passportNumber: { type: String },
  passportExpiry: { type: Date },
  passportIssueDate: { type: Date },

  phone: { type: String },
  email: { type: String }
},
{ timestamps: true }
);

export const CO_TRAVELLER_MODEL =
mongoose.model("coTraveller", coTravellerSchema);