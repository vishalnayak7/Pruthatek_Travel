import HotelService from "./hotel.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class HotelController {
  constructor() {
    this.hotelService =  HotelService;
  }

 getAll = async (req, res, next) => {
    try {
      const { cityCode } = req.query;

      if (!cityCode) {
        return res.fail("cityCode is required", null, statusCode.BAD_REQUEST);
      }

      const hotels = await this.hotelService.getAll(cityCode);

      return res.success("Hotels fetched successfully",hotels, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getOffers = async (req, res, next) => {
  try {
    const {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
    } = req.query;

    if (!cityCode || !checkInDate || !checkOutDate) {
      return res.fail("cityCode, checkInDate and checkOutDate are required", null, statusCode.BAD_REQUEST);
    }

    const offers = await this.hotelService.getHotelOffers({
      cityCode,
      checkInDate,
      checkOutDate,
      adults: Number(adults) || 1,
      roomQuantity: Number(roomQuantity) || 1,
    });

    return res.success("Hotel offers fetched successfully", offers,statusCode.OK);
  } catch (err) {
    next(err);
  }
};

getById = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.fail("hotelId is required", null, statusCode.BAD_REQUEST);
    }

    const hotel = await this.hotelService.getHotelById(hotelId);

    return res.success("Hotel fetched successfully", hotel, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

}
