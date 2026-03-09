import { CO_TRAVELLER_MODEL } from "./cotraveller.model.js";

class CotravellerService {

  async create(userId, data) {
    return CO_TRAVELLER_MODEL.create({
      userId,
      ...data
    });
  }

  async getAll(userId) {
    return CO_TRAVELLER_MODEL.find({ userId }).sort({ createdAt: -1 });
  }

  async update(id, userId, data) {

  const traveller = await CO_TRAVELLER_MODEL.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true }
  );

  if (!traveller) {
    const error = new Error("Co-traveller not found");
    error.statusCode = 404;
    throw error;
  }

  return traveller;
}

  async delete(id, userId) {

  const traveller = await CO_TRAVELLER_MODEL.findOneAndDelete({
    _id: id,
    userId
  });

  if (!traveller) {
    const error = new Error("Co-traveller not found");
    error.statusCode = 404;
    throw error;
  }

  return traveller;
}

}

export default new CotravellerService();