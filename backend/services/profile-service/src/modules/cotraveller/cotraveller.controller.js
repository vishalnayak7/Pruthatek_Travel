import CotravellerService from "./cotraveller.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class CotravellerController {
  constructor() {
    this.cotravellerService =  CotravellerService;
  }

  getAll = async (req, res, next) => {
    try {
            // res.fail('Todos not found');
       res.success("Get All Todos",todos, statusCode.OK);
      
    } catch (err) {
      next(err);
    }
  };
}
