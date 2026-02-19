import AuthService from "./auth.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

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

}
