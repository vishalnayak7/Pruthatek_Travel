import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {

async signup({ name, email, password, role }) {
  try {
    await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`
    );
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
      `${process.env.USER_SERVICE_URL}/api/v1/user/email/${email}`
    );

    const user = data.data;

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

async forgotPassword(email) {
  try {
    const { data } = await axios.post(
      `${process.env.USER_SERVICE_URL}/api/v1/user/forgot-password`,
      { email },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
        },
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      const err = new Error(error.response.data.message);
      err.statusCode = error.response.status;
      throw err;
    }
    throw error;
  }
}

async resetPassword(token, newPassword) {
  try {
    const { data } = await axios.post(
      `${process.env.USER_SERVICE_URL}/api/v1/user/reset-password`,
      { token, newPassword },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
        },
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      const err = new Error(error.response.data.message);
      err.statusCode = error.response.status;
      throw err;
    }
    throw error;
  }
}

}

export default new AuthService();

