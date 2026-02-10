import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {

async signup({ name, email, password, role }) {
  try {
    await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`,
      {
        headers: {
        "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
     }
  });
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  } catch (error) {
    if (error.response?.status !== 404) throw error;
  }

  const { data } = await axios.post(
    `${process.env.USER_SERVICE_URL}/api/v1/user/create`,
    {
      name,
      email,
      password, 
      role
    }
  );

  return {
    id: data.data._id,
    name: data.data.name,
    email: data.data.email,
    role: data.data.role
  };
}

async login({ email, password }) {
  try {
    // Get user by email
    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`,
      {
       headers: {
         "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET
    }
  });

    const user = data.data;

    // Block Google accounts from password login
    if (user.provider === "google") {
      const err = new Error("Please login using Google");
      err.statusCode = 400;
      throw err;
    }

     // ensure password exists
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
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  } catch (error) {
    if (error.response?.status === 404 || error.statusCode === 401) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }
    throw error; 
  }
}

async googleLogin(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    const { data } = await axios.post(
      `${process.env.USER_SERVICE_URL}/api/v1/user/google-login`,
      { email, name, googleId },
      { headers: { "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET } }
    );

    const user = data.data;

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  } catch (err) {
    console.error("Google login failed:", err.message);
    err.statusCode = 401;
    throw err;
  }
}


}

export default new AuthService();

