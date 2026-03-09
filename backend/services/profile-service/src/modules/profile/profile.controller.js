import ProfileService from "./profile.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class ProfileController {

  constructor() {
    this.profileService = ProfileService;
  }

  getProfile = async (req, res, next) => {
    try {

      const userId = req.user.id;
      const profile = await this.profileService.getProfile(userId);

      res.success("Profile fetched successfully", profile, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

  updateGeneral = async (req, res, next) => {
    try {

      const userId = req.user.id;
      const profile = await this.profileService.updateGeneral(userId, req.body);

      res.success("General info updated", profile);

    } catch (err) {
      next(err);
    }
  };

  updateContact = async (req, res, next) => {
    try {

      const userId = req.user.id;

      const profile = await this.profileService.updateContact(userId, req.body);
      res.success("Contact updated", profile);

    } catch (err) {
      next(err);
    }
  };

  updateDocuments = async (req, res, next) => {
    try {

      const userId = req.user.id;
      const profile = await this.profileService.updateDocuments(userId, req.body);

      res.success("Documents updated", profile);

    } catch (err) {
      next(err);
    }
  };

  updateTravelPreferences = async (req, res, next) => {
    try {

      const userId = req.user.id;
      const profile = await this.profileService.updateTravelPreferences(userId, req.body);

      res.success("Travel preferences updated", profile);

    } catch (err) {
      next(err);
    }
  };

  addFrequentFlyer = async (req, res, next) => {
    try {

      const userId = req.user.id;

      const profile = await this.profileService.addFrequentFlyer(userId, req.body);

      res.success("Frequent flyer added", profile);

    } catch (err) {
      next(err);
    }
  };

  deleteFrequentFlyer = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const flyerId = req.params.id;

    const profile = await this.profileService.deleteFrequentFlyer(userId, flyerId);
    if(profile)

    res.success("Frequent flyer removed", profile);

  } catch (err) {
    next(err);
  }
};

}