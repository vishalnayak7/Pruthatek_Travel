import { USER_MODEL } from "./user.model.js"; 

class UserService {

  async create(data) {
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

async verifyOtp(email) {
  const user = await USER_MODEL.findOneAndUpdate(
    { email },
    {
      emailVerified: true,
      phoneVerified: true,
      status: "OTP_VERIFIED",
      emailOtpHash: null,
      phoneOtpHash: null,
      otpExpiry: null
    },
    { new: true }
  );

  return user;
}

async updateOtpStatus({ email, emailVerified, phoneVerified, status }) {
  return USER_MODEL.findOneAndUpdate(
    { email },
    {
      emailVerified,
      phoneVerified,
      status,
      ...(status === "OTP_VERIFIED" && {
        emailOtpHash: null,
        phoneOtpHash: null,
        otpExpiry: null
      })
    },
    { new: true }
  );
}

async setPassword({ email, password, status }) {
  return USER_MODEL.findOneAndUpdate(
    { email },
    {
      password,
      status,
      emailOtpHash: null,
      phoneOtpHash: null,
      otpExpiry: null
    },
    { new: true }
  );
}

async updateOtp({ email, emailOtpHash, phoneOtpHash, otpExpiry }) {
  return USER_MODEL.findOneAndUpdate(
    { email },
    {
      ...(emailOtpHash && { emailOtpHash }),
      ...(phoneOtpHash && { phoneOtpHash }),
      otpExpiry
    },
    { new: true }
  );
}

}

export default new UserService();
