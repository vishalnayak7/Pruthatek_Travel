import { CORPORATE_MODEL } from "./corporate.model.js";

class CorporateService {

  async create(data) {
    return CORPORATE_MODEL.create(data);
  }

  async getByEmail(email) {
    return CORPORATE_MODEL.findOne({ email }).select("+password");
  }

  async updateOtp({ email, emailOtpHash, otpExpiry }) {
    return CORPORATE_MODEL.findOneAndUpdate(
      { email },
      { emailOtpHash, otpExpiry },
      { new: true }
    );
  }

  async verifyOtp(email) {
    return CORPORATE_MODEL.findOneAndUpdate(
      { email },
      {
        emailVerified: true,
        emailOtpHash: null,
        otpExpiry: null,
        status: "OTP_VERIFIED"
      },
      { new: true }
    );
  }

  async completeProfile({ email, ...profileData }) {
  return CORPORATE_MODEL.findOneAndUpdate(
    { email },
    {
      ...profileData,
      // status: "ACTIVE",
      isProfileComplete: true
    },
    { new: true }
  );
}

  // async setPassword({ email, password }) {
  //   return CORPORATE_MODEL.findOneAndUpdate(
  //     { email },
  //     { password },
  //     { new: true }
  //   );
  // }
  async setPassword({ email, password }) {
  return CORPORATE_MODEL.findOneAndUpdate(
    { email },
    { 
      password,
      status: "ACTIVE"
    },
    { new: true }
  );
}

  async getAll() {
    return CORPORATE_MODEL.find().select("-password");
  }

  async updateResetEmailOtp({ email, hash, expiry }) {
  return CORPORATE_MODEL.findOneAndUpdate(
    { email },
    {
      resetEmailOtpHash: hash,
      resetEmailOtpExpiry: expiry
    },
    { new: true }
  );
}

async resetPasswordByEmail({ email, password }) {
  const corp = await CORPORATE_MODEL.findOneAndUpdate(
    { email },
    {
      password,
      resetEmailOtpHash: null,
      resetEmailOtpExpiry: null
    },
    { new: true }
  );

  if (!corp) {
    throw Object.assign(new Error("Corporate not found"), {
      statusCode: 404
    });
  }

  return corp;
}
}

export default new CorporateService();