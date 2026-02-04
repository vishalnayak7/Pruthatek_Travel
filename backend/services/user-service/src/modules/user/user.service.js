import bcrypt from "bcryptjs";
import { USER_MODEL } from "./user.model.js"; 

class UserService {

  async create(data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return USER_MODEL.create(data);
}

  async getAll() {
    return USER_MODEL.find().select("-password");
  }

  async getById(id) {
    return USER_MODEL.findById(id).select("-password");
  }

  async getByEmail(email) {
    return USER_MODEL.findOne({ email }).select("+password");
  }

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return USER_MODEL.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select("-password");
  }

  async delete(id) {
    return USER_MODEL.findByIdAndDelete(id);
  }
}

export default new UserService();
