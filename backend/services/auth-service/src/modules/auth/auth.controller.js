import AuthService from "./auth.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";
import jwt from "jsonwebtoken";

export default class AuthController {
  constructor() {
    this.authService = AuthService;
  }

  signup = async (req, res, next) => {
    try {
      const user = await this.authService.signup(req.body);

      res.status(statusCode.CREATED).json({
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  verifyOtp = async (req, res, next) => {
  try {
    const { email, emailOtp, phoneOtp } = req.body;

    const result = await AuthService.verifyOtp({
      email,
      emailOtp,
      phoneOtp
    });

    res.status(200).json({
      message: result.message
    });

  } catch (error) {
    next(error);
  }
}

setPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const result = await this.authService.setPassword({
      email,
      password
    });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const result = await this.authService.login({
      email,
      password
    });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

resendOtp = async (req, res, next) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({
        message: "Email and type required"
      });
    }

    const result = await this.authService.resendOtp({
      email,
      type
    });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone is required"
      });
    }

    const result = await this.authService.forgotPassword({ phone });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

resetPassword = async (req, res, next) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({
        message: "Phone, OTP and new password are required"
      });
    }

    const result = await this.authService.resetPassword({
      phone,
      otp,
      newPassword
    });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

googleSignIn = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID Token is required"
      });
    }

    const result = await this.authService.googleSignIn({ idToken });

    res.status(200).json({
      success: true,
      message: "Google Sign-In successful",
      data: result
    });

  } catch (err) {
    console.error("Google Sign-In error:", err.message);

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};

logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];

    // Decode token HERE (instead of req.user)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expiresAt = decoded.exp * 1000;

    await this.authService.logout(token, expiresAt);

    res.success("Logout successful", statusCode.OK);

  } catch (err) {
    next(err);
  }
};

validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const result = await this.authService.validateToken(token);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
}
