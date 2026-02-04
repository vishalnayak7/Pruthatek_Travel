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
}
