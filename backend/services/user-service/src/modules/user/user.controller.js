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

  update = async (req, res, next) => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      if (!user) return res.fail("User not found", statusCode.NOT_FOUND);

      res.success("User updated successfully", user);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const user = await this.userService.delete(req.params.id);
      if (!user) return res.fail("User not found", statusCode.NOT_FOUND);

      res.success("User deleted successfully");
    } catch (err) {
      next(err);
    }
  };

googleLogin = async (req, res, next) => {
  try {
    const user = await this.userService.googleLogin(req.body);
    res.success("User authenticated", user);
  } catch (err) {
    next(err);
  }
};

}
