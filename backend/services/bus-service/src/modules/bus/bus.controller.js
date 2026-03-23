import BusService from "./bus.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class BusController {
  constructor() {
    this.busService = BusService;
  }

  search = async (req, res, next) => {
    try {
      const {
        origin,
        destination,
        departureDate,
        passengers
      } = req.query;

      if (!origin || !destination || !departureDate) {
        return res.fail("origin, destination and departureDate are required", null, statusCode.BAD_REQUEST);
      }

      const buses = await this.busService.searchBuses({
        origin,
        destination,
        departureDate,
        passengers: Number(passengers) || 1
      });

      return res.success("Buses fetched successfully", buses, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
