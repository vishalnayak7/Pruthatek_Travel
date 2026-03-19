import Corporate_authService from "./corporate_auth.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Corporate_authController {
  constructor() {
    this.corporate_authService = Corporate_authService;
  }

  sendEmailOtp = async (req, res, next) => {
    try {
      const result = await this.corporate_authService.sendEmailOtp(req.body);
      res.success("Email OTP sent successfully", result, statusCode.OK);
    } catch (err) {
       next(err);
     }
   };

  verifyEmailOtp = async (req, res, next) => {
    try {
      const result = await this.corporate_authService.verifyEmailOtp(req.body);
      res.success("Email OTP verified successfully", result, statusCode.OK);
    } catch (err) {
       next(err);
     }
   };

  completeProfile = async (req, res, next) => {
    try {
      const result = await this.corporate_authService.completeProfile(req.body);
      res.success("Profile completed successfully", result, statusCode.OK);
    } catch (err) {
       next(err);
     }
   };

  setPassword = async (req, res, next) => {
    try {
      const result = await this.corporate_authService.setPassword(req.body);
      res.success("Password set successfully", result, statusCode.OK);
    } catch (err) {
       next(err);
     }
   };

  login = async (req, res, next) => {
    try {
      const result = await this.corporate_authService.login(req.body);
      res.success("Login successful", result, statusCode.OK);
    } catch (err) {
       next(err);
     }
   };

   forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await this.corporate_authService.forgotPassword({ email });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required"
      });
    }

    const result = await this.corporate_authService.resetPassword({
      email,
      otp,
      newPassword
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const result = await this.corporate_authService.resendOtp({ email });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
}