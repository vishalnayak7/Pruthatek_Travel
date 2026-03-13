import { PROFILE_MODEL } from "./profile.model.js";
import { LOGOUT_TOKEN_MODEL } from "./logoutToken.model.js";

class ProfileService {

  async getProfile(userId) {
    return PROFILE_MODEL.findOne({ userId });
  }

  async updateGeneral(userId, data) {

  const updateData = {};

  for (const key in data) {
    updateData[`generalInfo.${key}`] = data[key];
  }

  return PROFILE_MODEL.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true }
  );
}

  async updateContact(userId, data) {

  const updateData = {};

  for (const key in data) {
    updateData[`contact.${key}`] = data[key];
  }

  return PROFILE_MODEL.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true }
  );
}

  async updateDocuments(userId, data) {

  const updateData = {};

  for (const key in data) {
    updateData[`documents.${key}`] = data[key];
  }

  return PROFILE_MODEL.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true }
  );
}

  async updateTravelPreferences(userId, data) {
    return PROFILE_MODEL.findOneAndUpdate(
      { userId },
      { $set: { travelPreferences: data } },
      { new: true, upsert: true }
    );
  }

  async addFrequentFlyer(userId, flyer) {
    return PROFILE_MODEL.findOneAndUpdate(
      { userId },
      { $push: { frequentFlyers: flyer } },
      { new: true, upsert: true }
    );
  }

  async deleteFrequentFlyer(userId, flyerId) {

  const result = await PROFILE_MODEL.findOneAndUpdate(
    { userId, "frequentFlyers._id": flyerId },
    { $pull: { frequentFlyers: { _id: flyerId } } },
    { new: true }
  );

  if (!result) {
    throw new Error("Frequent flyer not found");
  }

  return result;
}

 async logout(token, expiresAt) {
    return LOGOUT_TOKEN_MODEL.create({
      token,
      expiresAt: new Date(expiresAt)
    });
  }

}

export default new ProfileService();