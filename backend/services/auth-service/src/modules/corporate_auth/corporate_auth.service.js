import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp } from "../../utils/otp.js";
import { sendEmailOtp } from "../../utils/email.js";
import { sendResetPasswordOtp } from "../../utils/sendResetOtp.js";

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");


 class Corporate_authService {
   
 internalHeaders() {
    return {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
      }
    };
  }

  async sendEmailOtp({ email }) {

    const headers = this.internalHeaders();

    let corporate;

    try {
      const { data } = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
        headers
      );
      corporate = data.data;
    } catch (err) {
      if (err.response?.status !== 404) throw err;
    }

    if (corporate?.emailVerified) {
    return {
      message: "Email already verified."
    };
  }

    const { otp, hash } = generateOtp();

    if (!corporate) {
      await axios.post(
        `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/create`,
        {
          email,
          emailOtpHash: hash,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
          status: "PENDING_VERIFICATION"
        },
        headers
      );
    } else {
      await axios.patch(
        `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/update-otp`,
        {
          email,
          emailOtpHash: hash,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
        },
        headers
      );
    }

    await sendEmailOtp(email, otp);

    return { message: "OTP sent to business email" };
  }

async verifyEmailOtp({ email, otp }) {
  const headers = this.internalHeaders();
  let corporate;

  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
      headers
    );
    corporate = data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error("Corporate not found");
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }

  if (corporate.emailVerified) {
    return {
      message: "Email already verified",
      isProfileComplete: corporate.isProfileComplete
    };
  }

  if (!corporate.otpExpiry || Date.now() > new Date(corporate.otpExpiry)) {
    const err = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  if (hashOtp(otp) !== corporate.emailOtpHash) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/verify-otp`,
    { email },
    headers
  );

  return {
    message: "OTP verified",
    isProfileComplete: corporate.isProfileComplete
  };
}

  async completeProfile(payload) {
  const headers = this.internalHeaders();

  const { data } = await axios.get(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${payload.email}`,
    headers
  );

  const corporate = data.data;

  if (!corporate.emailVerified) {
    throw Object.assign(
      new Error("Verify email OTP before completing profile"),
      { statusCode: 400 }
    );
  }

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/complete-profile`,
    payload,
    headers
  );

  return { message: "Profile completed" };
}

async setPassword({ email, password }) {
  const headers = this.internalHeaders();
  let corporate;

  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
      headers
    );

    corporate = data.data;

  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error("Corporate not found");
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }

  if (!corporate.emailVerified) {
    const err = new Error("Verify email before setting password");
    err.statusCode = 400;
    throw err;
  }

  if (corporate.password) {
    const err = new Error("Password already set. Please login.");
    err.statusCode = 400;
    throw err;
  }

  if (!corporate.isProfileComplete) {
    const err = new Error("Complete profile before setting password");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/set-password`,
    { email, password: hashedPassword },
    headers
  );

  return { message: "Password set successfully" };
}

  async login({ email, password }) {

  const headers = this.internalHeaders();

  const { data } = await axios.get(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
    headers
  );

  const corporate = data.data;

  // Check if user exists and password is set
  if (!corporate || !corporate.password) {
    throw Object.assign(
      new Error("Invalid credentials"),
      { statusCode: 401 }
    );
  }

  if (corporate.status !== "ACTIVE") {
    throw Object.assign(
      new Error("Account not active"),
      { statusCode: 403 }
    );
  }

  const isMatch = await bcrypt.compare(password, corporate.password);

  if (!isMatch) {
    throw Object.assign(
      new Error("Invalid credentials"),
      { statusCode: 401 }
    );
  }

  const token = jwt.sign(
    { id: corporate._id, accountType: "CORPORATE" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
}

  async forgotPassword({ email }) {

  const headers = this.internalHeaders();

  const corporate = await axios
    .get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
      headers
    )
    .then(res => res.data.data)
    .catch(() => {
      throw Object.assign(
        new Error("Invalid request"),
        { statusCode: 404 }
      );
    });

  if (corporate.status !== "ACTIVE") {
    throw Object.assign(
      new Error("Account not active"),
      { statusCode: 400 }
    );
  }

  const { otp, hash } = generateOtp();

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/update-reset-email-otp`,
    {
      email,
      hash,
      expiry: new Date(Date.now() + 10 * 60 * 1000)
    },
    headers
  );

  // await sendEmailOtp(email, otp);
  await sendResetPasswordOtp(email, otp);

  return { message: "Reset OTP sent to email" };
}

async resetPassword({ email, otp, newPassword }) {

  const headers = this.internalHeaders();

  const corporate = await axios
    .get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/email/${email}`,
      headers
    )
    .then(res => res.data.data)
    .catch(() => {
      throw Object.assign(
        new Error("Invalid request"),
        { statusCode: 404 }
      );
    });

  if (!corporate.resetEmailOtpHash) {
    throw Object.assign(
      new Error("No reset request found"),
      { statusCode: 400 }
    );
  }

  if (
    !corporate.resetEmailOtpExpiry ||
    Date.now() > new Date(corporate.resetEmailOtpExpiry).getTime()
  ) {
    throw Object.assign(
      new Error("OTP expired"),
      { statusCode: 400 }
    );
  }

  if (hashOtp(otp) !== corporate.resetEmailOtpHash) {
    throw Object.assign(
      new Error("Invalid OTP"),
      { statusCode: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/corporate/reset-password-email`,
    {
      email,
      password: hashedPassword
    },
    headers
  );

  return { message: "Password reset successfully" };
}
}

export default new Corporate_authService();
