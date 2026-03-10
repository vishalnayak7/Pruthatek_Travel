import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { generateOtp } from "../../utils/otp.js";
import { sendEmailOtp } from "../../utils/email.js";
import { sendSmsOtp } from "../../utils/sms.js";
import crypto from "crypto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

class AuthService {

async signup({ email, phone }) {
  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  const existingUser = await axios.get(
    `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`,
    internalHeaders
  ).catch(() => null);

  if (existingUser?.data?.data) {
    const err = new Error("Email already exists");
    err.statusCode = 409;
    throw err;
  }

  const { otp: emailOtp, hash: emailHash } = generateOtp();
  const { otp: phoneOtp, hash: phoneHash } = generateOtp();

  await axios.post(
    `${process.env.USER_SERVICE_URL}/api/v1/user/create`,
    {
      email,
      phone,
      emailOtpHash: emailHash,
      phoneOtpHash: phoneHash,
      // otpExpiry: Date.now() + 10 * 60 * 1000,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      status: "PENDING_VERIFICATION"
    },
    internalHeaders
  );

  await sendEmailOtp(email, emailOtp);
  await sendSmsOtp(phone, phoneOtp);

  return { message: "OTP sent" };
}

async verifyOtp({ email, emailOtp, phoneOtp }) {
  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  const user = await axios
  .get(`${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`, internalHeaders)
  .then(res => res.data.data)
  .catch(err => {
    if (err.response?.status === 404) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    throw err;
  });

  if (user.emailVerified && user.phoneVerified) {
    return { message: "OTP already verified" };
  }

  if (!emailOtp && !phoneOtp) {
    throw Object.assign(new Error("At least one OTP required"), { statusCode: 400 });
  }

  if (user.otpExpiry && Date.now() > new Date(user.otpExpiry).getTime()) {
    throw Object.assign(new Error("OTP expired"), { statusCode: 400 });
  }

  let emailVerified = user.emailVerified;
  let phoneVerified = user.phoneVerified;

  if (!emailVerified && emailOtp) {
    if (hashOtp(emailOtp) !== user.emailOtpHash) {
      throw Object.assign(new Error("Invalid email OTP"), { statusCode: 400 });
    }
    emailVerified = true;
  }

  if (!phoneVerified && phoneOtp) {
    if (hashOtp(phoneOtp) !== user.phoneOtpHash) {
      throw Object.assign(new Error("Invalid phone OTP"), { statusCode: 400 });
    }
    phoneVerified = true;
  }

  const status =
    emailVerified && phoneVerified
      ? "OTP_VERIFIED"
      : "PENDING_VERIFICATION";

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/update-otp-status`,
    { email, emailVerified, phoneVerified, status },
    internalHeaders
  );

  return {
    message:
      status === "OTP_VERIFIED"
        ? "Both OTPs verified"
        : "Partially verified"
  };
}

async setPassword({ email, password }) {
  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  const user = await axios
  .get(`${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`, internalHeaders)
  .then(res => res.data.data)
  .catch(err => {
    if (err.response?.status === 404) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    throw err;
  });

  if (user.status === "ACTIVE") {
    return { message: "Password already set" };
  }

  if (user.status !== "OTP_VERIFIED") {
    const err = new Error("OTP not verified");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/set-password`,
    {
      email,
      password: hashedPassword,
      status: "ACTIVE"
    },
    internalHeaders
  );

  return { message: "Password set successfully. Account activated." };
}

async login({ email, password }) {
  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  let user;

  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`,
      internalHeaders
    );

    user = data.data;

  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    throw error; 
  }

  // if (!user || !user.password) {
  //   const err = new Error("Invalid credentials");
  //   err.statusCode = 401;
  //   throw err;
  // }

  // if (user.status !== "ACTIVE") {
  //   const err = new Error("Account not activated");
  //   err.statusCode = 403;
  //   throw err;
  // }
if (user.status !== "ACTIVE") {
  const err = new Error("Account not activated");
  err.statusCode = 403;
  throw err;
}

if (!user.password) {
  const err = new Error("Invalid credentials");
  err.statusCode = 401;
  throw err;
}

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
}

async resendOtp({ email, type }) {

  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  const user = await axios
  .get(`${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`, internalHeaders)
  .then(res => res.data.data)
  .catch(err => {
    if (err.response?.status === 404) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    throw err;
  });

// if (!user) {
//   throw Object.assign(new Error("User not found"), { statusCode: 404 });
// }

  if (user.status === "ACTIVE") {
  throw Object.assign(
    new Error("Account already active"),
    { statusCode: 400 }
  );
}

if (user.status === "OTP_VERIFIED") {
  throw Object.assign(
    new Error("OTP already verified"),
    { statusCode: 400 }
  );
}

  let updatePayload = {};

  if ((type === "email" || type === "both") && !user.emailVerified) {
    const { otp, hash } = generateOtp();
    await sendEmailOtp(email, otp);
    updatePayload.emailOtpHash = hash;
  }

  if ((type === "phone" || type === "both") && !user.phoneVerified) {
    const { otp, hash } = generateOtp();
    await sendSmsOtp(user.phone, otp);
    updatePayload.phoneOtpHash = hash;
  }

  updatePayload.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/update-otp`,
    {
      email,
      ...updatePayload
    },
    internalHeaders
  );

  return { message: "OTP resent successfully" };
}

async forgotPassword({ phone }) {

  const internalHeaders = {
    headers: { "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET }
  };

  const user = await axios
    .get(`${process.env.USER_SERVICE_URL}/api/v1/user/phone/${phone}`, internalHeaders)
    .then(res => res.data.data)
    .catch(() => {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    });

  if (user.status !== "ACTIVE") {
    throw Object.assign(new Error("Account not active"), { statusCode: 400 });
  }

  const { otp, hash } = generateOtp();

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/update-reset-phone-otp`,
    {
      phone,
      hash,
      expiry: new Date(Date.now() + 10 * 60 * 1000)
    },
    internalHeaders
  );

  await sendSmsOtp(phone, otp);

  return { message: "Reset OTP sent to phone" };
}

async resetPassword({ phone, otp, newPassword }) {

  const internalHeaders = {
    headers: { "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET }
  };

  const user = await axios
    .get(`${process.env.USER_SERVICE_URL}/api/v1/user/phone/${phone}`, internalHeaders)
    .then(res => res.data.data)
    .catch(() => {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    });

  if (!user.resetPhoneOtpHash) {
    throw Object.assign(new Error("No reset request found"), { statusCode: 400 });
  }

  if (!user.resetPhoneOtpExpiry || Date.now() > new Date(user.resetPhoneOtpExpiry).getTime()) {
    throw Object.assign(new Error("OTP expired"), { statusCode: 400 });
  }

  if (hashOtp(otp) !== user.resetPhoneOtpHash) {
    throw Object.assign(new Error("Invalid OTP"), { statusCode: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/reset-password-phone`,
    {
      phone,
      password: hashedPassword
    },
    internalHeaders
  );

  return { message: "Password reset successfully" };
}

async googleSignIn({ idToken }) {
  if (!idToken) {
    const err = new Error("Google ID token required");
    err.statusCode = 400;
    throw err;
  }

  // Verify Google token
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.error("Error verifying Google ID token:", err.message);
    const error = new Error("Invalid Google ID token");
    error.statusCode = 401;
    throw error;
  }

  const email = payload.email;
  const name = payload.name;
  const googleId = payload.sub;

  const internalHeaders = {
    headers: {
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  };

  // Check if user exists
  let user;
  try {
    const res = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`, internalHeaders);
    user = res.data.data;
  } catch (err) {
    console.warn("User not found, will create new user:", err.response?.data?.message || err.message);
    user = null;
  }

  // If user exists but not linked with Google
if (user && !user.googleId) {
  await axios.patch(
    `${process.env.USER_SERVICE_URL}/api/v1/user/link-google`,
    { email, googleId, provider: "google" },
    internalHeaders
  );

  user.googleId = googleId;
  user.provider = "google";
}

  // Create user if doesn't exist
  if (!user) {
    try {
      const res = await axios.post(`${process.env.USER_SERVICE_URL}/api/v1/user/create`, {
        email,
        status: "ACTIVE",       // Google users are active by default
        emailVerified: true,
        phoneVerified: true,
        googleId,               
        provider: "google"      
      }, internalHeaders);

      user = res.data.data;
    } catch (err) {
      console.error("Error creating user:", err.response?.data || err.message);
      const error = new Error("Failed to create user via Google Sign-In");
      error.statusCode = 500;
      throw error;
    }
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, provider: user.provider },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
}
}

export default new AuthService();