import AuthService from "./auth.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class AuthController {
  constructor() {
    this.authService = AuthService;
  }

  signup = async (req, res, next) => {
    try {
      const user = await this.authService.signup(req.body);
      res.success("Signup successful", user, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const token = await this.authService.login(req.body);
      res.success("Login successful", token, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await this.authService.forgotPassword(email);

    res.success(result.message, null);
  } catch (err) {
    next(err);
  }
};

resetPassword = async (req, res, next) => {
  try {
    const result = await this.authService.resetPassword(
      req.body.token,
      req.body.newPassword
    );
    res.success(result.message);
  } catch (err) {
    next(err);
  }
};

googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const result = await this.authService.googleLogin(idToken);
    res.success("Google login successful", result);
  } catch (err) {
    next(err);
  }
};

}
