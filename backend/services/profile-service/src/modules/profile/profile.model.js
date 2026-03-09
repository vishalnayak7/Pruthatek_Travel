import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
{
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },

  generalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },

    gender: { type: String },
    nationality: { type: String },
    maritalStatus: { type: String },

    
    anniversary: { type: Date },
    city: { type: String },
    state: { type: String }
  },

  contact: {
    alternatePhone: { type: String },
    alternateEmail: { type: String }
  },

  documents: {
    passportNumber: { type: String },
    passportExpiry: { type: Date },
    issuingCountry: { type: String },
    panNumber: { type: String }
  },

  travelPreferences: {
    autoAddInsurance: { type: Boolean, default: false }
  },
  frequentFlyers: [
    {
      airline: { type: String },
      frequentFlyerNumber: { type: String }
    }
  ]

},
{ timestamps: true }
);

export const PROFILE_MODEL = mongoose.model("profile", profileSchema);