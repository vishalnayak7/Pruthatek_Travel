import CorporateService from "./corporate.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class CorporateController {

  constructor() {
    this.corporateService = CorporateService;
  }

  getAll = async (req, res, next) => {
    try {
      const corporates = await this.corporateService.getAll();
      res.success("Corporates fetched", corporates, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getByEmail = async (req, res, next) => {
    try {
      const corp = await this.corporateService.getByEmail(req.params.email);
      if (!corp) return res.fail("Corporate not found", 404);
      res.success("Corporate fetched", corp);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const corp = await this.corporateService.create(req.body);
      res.success("Corporate created", corp, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  updateOtp = async (req, res, next) => {
    try {
      const corp = await this.corporateService.updateOtp(req.body);
      res.success("OTP updated", corp);
    } catch (err) {
      next(err);
    }
  };

  verifyOtp = async (req, res, next) => {
    try {
      const corp = await this.corporateService.verifyOtp(req.body.email);
      res.success("OTP verified", corp);
    } catch (err) {
      next(err);
    }
  };

  completeProfile = async (req, res, next) => {
    try {
      const corp = await this.corporateService.completeProfile(req.body);
      res.success("Profile completed", corp);
    } catch (err) {
      next(err);
    }
  };

  setPassword = async (req, res, next) => {
    try {
      const corp = await this.corporateService.setPassword(req.body);
      res.success("Password set", corp);
    } catch (err) {
      next(err);
    }
  };

  updateResetEmailOtp = async (req, res, next) => {
  try {
    const corp = await this.corporateService.updateResetEmailOtp(req.body);
    res.success("Reset OTP updated", corp);
  } catch (err) {
    next(err);
  }
};

resetPasswordByEmail = async (req, res, next) => {
  try {
    const corp = await this.corporateService.resetPasswordByEmail(req.body);
    res.success("Password reset successful", corp);
  } catch (err) {
    next(err);
  }
};
}