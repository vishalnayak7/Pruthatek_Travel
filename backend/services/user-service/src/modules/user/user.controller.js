import UserService from "./user.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class UserController {
  constructor() {
    this.userService =  UserService;
  }

  create = async (req, res, next) => {
  try {
    const user = await this.userService.create(req.body);
    res.success("User created successfully", user, statusCode.CREATED);
  } catch (err) {
    next(err);
  }
};

getByEmail = async (req, res, next) => {
  try {
    const user = await this.userService.getByEmail(req.params.email);
    if (!user) {
      return res.fail("User not found", statusCode.NOT_FOUND);
    }
    res.success("User fetched", user);
  } catch (err) {
    next(err);
  }
};

  getAll = async (req, res, next) => {
    try {
      const users = await this.userService.getAll();
      res.success("Users fetched successfully", users);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userService.getById(req.params.id);
      if (!user) return res.fail("User not found", statusCode.NOT_FOUND);
  
      res.success("User fetched successfully", user);
    } catch (err) {
      next(err);
    }
  };

  updateOtpStatus = async (req, res, next) => {
  try {
    const user = await this.userService.updateOtpStatus(req.body);
    res.success("OTP status updated", user);
  } catch (err) {
    next(err);
  }
};

setPassword = async (req, res, next) => {
  try {
    const user = await this.userService.setPassword(req.body);
    res.success("Password saved", user);
  } catch (err) {
    next(err);
  }
};

updateOtp = async (req, res, next) => {
  try {
    const user = await this.userService.updateOtp(req.body);
    res.success("OTP updated", user);
  } catch (err) {
    next(err);
  }
};

getByPhone = async (req, res, next) => {
  try {
    const user = await this.userService.getByPhone(req.params.phone);

    if (!user) {
      return res.fail("User not found", statusCode.NOT_FOUND);
    }

    res.success("User fetched", user);

  } catch (err) {
    next(err);
  }
};

updateResetPhoneOtp = async (req, res, next) => {
  try {
    const { phone, hash, expiry } = req.body;

    const user = await this.userService.updateResetPhoneOtp({
      phone,
      hash,
      expiry
    });

    res.success("Reset OTP updated", user);

  } catch (err) {
    next(err);
  }
};

resetPasswordByPhone = async (req, res, next) => {
  try {
    const user = await this.userService.resetPasswordByPhone(req.body);

    if (!user) {
      return res.fail("User not found", 404);
    }

    res.success("Password reset successful", user);
  } catch (err) {
    next(err);
  }
};

linkGoogle = async (req, res, next) => {
  try {
    const user = await this.userService.linkGoogle(req.body);
    res.success("Google linked", user);
  } catch (err) {
    next(err);
  }
};

}
