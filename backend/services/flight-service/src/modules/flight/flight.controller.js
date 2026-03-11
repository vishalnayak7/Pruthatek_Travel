import FlightService from "./flight.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class FlightController {
  constructor() {
    this.flightService = FlightService;
  }

  search = async (req, res, next) => {
    try {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        travelClass
      } = req.query;

      if (!origin || !destination || !departureDate) {
        return res.fail("origin, destination and departureDate are required", null, statusCode.BAD_REQUEST);
      }

      const flights = await this.flightService.searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults: Number(adults) || 1,
        travelClass
      });

      return res.success("Flights fetched successfully", flights, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

price = async (req, res, next) => {
  try {
    const { offer } = req.body;

    if (!offer) {
      return res.fail("Flight offer is required", null, statusCode.BAD_REQUEST);
    }

    const pricing = await this.flightService.priceFlight(offer);

    return res.success("Flight price confirmed successfully", pricing, statusCode.OK);

  } catch (error) {
    console.error(
      "Flight Pricing Controller Error:",
      error.response?.data || error.message
    );
    next(error);
  }
};

}
