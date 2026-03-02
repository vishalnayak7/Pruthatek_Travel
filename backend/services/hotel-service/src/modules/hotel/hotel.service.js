import axios from "axios";
import { getAmadeusToken } from "../../helpers/amadeus.js";
import getHotelImages from "../../helpers/googlePlaces.js";

class HotelService {
  async getAll(cityCode) {
    const token = await getAmadeusToken();

    const response = await axios.get(
      `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          cityCode,
        },
      }
    );

    return Promise.all(
  response.data.data.map(async (hotel) => ({
    hotelId: hotel.hotelId,
    name: hotel.name,
    chainCode: hotel.chainCode || null,
    rating: hotel.rating || null,
    cityCode,
    cityName: hotel.address?.cityName || null,
    countryCode: hotel.address?.countryCode || null,
    location: hotel.geoCode || null,
    address: hotel.address || null,

images:
          (await getHotelImages({
            hotelName: hotel.name,
            city: hotel.address?.cityName || cityCode,
            limit: 5,
          })) || [],

        source: "AMADEUS",
      }))
    );
  }

  async getHotelOffers({
  cityCode,
  checkInDate,
  checkOutDate,
  adults = 1,
  roomQuantity = 1,
}) {
  const token = await getAmadeusToken();

  // Get hotels by city (limit to avoid API overload)
  const hotelsResponse = await axios.get(
    `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { cityCode },
    }
  );

  const hotelIds = hotelsResponse.data.data
    .slice(0, 10) 
    .map((hotel) => hotel.hotelId);

  if (!hotelIds.length) return [];

  // Get real offers (pricing + availability)
  const offersResponse = await axios.get(
    `${process.env.AMADEUS_BASE_URL}/v3/shopping/hotel-offers`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        hotelIds: hotelIds.join(","),
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity,
        currency: "INR",
      },
    }
  );

  // return offersResponse.data.data;
  return offersResponse.data.data || [];
}

}

export default new HotelService();
