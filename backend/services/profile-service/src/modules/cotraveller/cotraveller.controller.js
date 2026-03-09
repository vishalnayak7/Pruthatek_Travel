import CotravellerService from "./cotraveller.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class CotravellerController {

  constructor() {
    this.cotravellerService = CotravellerService;
  }

  create = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const traveller =
      await this.cotravellerService.create(userId, req.body);

    res.success("Co-traveller created", traveller, statusCode.CREATED);

  } catch (err) {
    next(err);
  }
};

  getAll = async (req, res, next) => {
    try {

      const userId = req.user.id;

      const travellers =
        await this.cotravellerService.getAll(userId);

      res.success("Co-travellers fetched", travellers, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };


  update = async (req, res, next) => {
    try {

      const { id } = req.params;
      const userId = req.user.id;

      const traveller =
        await this.cotravellerService.update(id, userId, req.body);

      res.success("Co-traveller updated", traveller, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };


  delete = async (req, res, next) => {
    try {

      const { id } = req.params;
      const userId = req.user.id;

      const traveller = await this.cotravellerService.delete(id, userId);

      res.success("Co-traveller deleted", traveller, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

}