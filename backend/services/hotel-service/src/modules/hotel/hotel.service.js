import axios from "axios";
import { getAmadeusToken } from "../../helpers/amadeus.js";
import getHotelImages from "../../helpers/googlePlaces.js";
import redisClient from "../../helpers/redis.js";

class HotelService {
//   async getAll(cityCode) {
//     const token = await getAmadeusToken();

//     const response = await axios.get(
//       `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           cityCode,
//         },
//       }
//     );

//     return Promise.all(
//   response.data.data.map(async (hotel) => ({
//     hotelId: hotel.hotelId,
//     name: hotel.name,
//     chainCode: hotel.chainCode || null,
//     rating: hotel.rating || null,
//     cityCode,
//     cityName: hotel.address?.cityName || null,
//     countryCode: hotel.address?.countryCode || null,
//     location: hotel.geoCode || null,
//     address: hotel.address || null,

// images:
//           (await getHotelImages({
//             hotelName: hotel.name,
//             city: hotel.address?.cityName || cityCode,
//             limit: 5,
//           })) || [],

//         source: "AMADEUS",
//       }))
//     );
//   }
async getAll(cityCode) {
  const cacheKey = `hotels:city:${cityCode}`;

  // Check cache
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log("⚡ Returning hotels from Redis");
    return JSON.parse(cachedData);
  }

  console.log("Fetching hotels from Amadeus");

  const token = await getAmadeusToken();

  const response = await axios.get(
    `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { cityCode },
    }
  );

  const hotels = await Promise.all(
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

  // Store in Redis (TTL 1 hour)
  await redisClient.set(cacheKey, JSON.stringify(hotels), {
    EX: 3600,
  });

  return hotels;
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

  return offersResponse.data.data || [];
}

// async getHotelById(hotelId) {
//   try {
//     const token = await getAmadeusToken();

//     const { data } = await axios.get(
//       `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-hotels`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { hotelIds: hotelId },
//       }
//     );

//     const hotel = data.data?.[0];
//     if (!hotel) throw Object.assign(new Error("Hotel not found"), { status: 404 });

//     const images =
//       (await getHotelImages({
//         hotelName: hotel.name,
//         city: hotel.address?.cityName,
//         limit: 8,
//       })) || [];

//     return {
//       hotelId: hotel.hotelId,
//       name: hotel.name,
//       rating: hotel.rating || null,
//       cityName: hotel.address?.cityName || null,
//       countryCode: hotel.address?.countryCode || null,
//       location: hotel.geoCode || null,
//       address: hotel.address || null,
//       amenities: hotel.amenities || [],
//       contact: hotel.contact || null,
//       images,
//       source: "AMADEUS",
//     };

//   } catch (error) {
//     const isNotFound = error.response?.status === 400;
//     throw Object.assign(
//       new Error(isNotFound ? "Hotel not found" : "Hotel provider error"),
//       { status: isNotFound ? 404 : error.response?.status || 500 }
//     );
//   }
// }
async getHotelById(hotelId) {
  const cacheKey = `hotel:detail:${hotelId}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning hotel detail from Redis");
    return JSON.parse(cached);
  }

  const token = await getAmadeusToken();

  const { data } = await axios.get(
    `${process.env.AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-hotels`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { hotelIds: hotelId },
    }
  );

  const hotel = data.data?.[0];
  if (!hotel) throw new Error("Hotel not found");

  const images =
    (await getHotelImages({
      hotelName: hotel.name,
      city: hotel.address?.cityName,
      limit: 8,
    })) || [];

  const result = {
    hotelId: hotel.hotelId,
    name: hotel.name,
    rating: hotel.rating || null,
    cityName: hotel.address?.cityName || null,
    countryCode: hotel.address?.countryCode || null,
    location: hotel.geoCode || null,
    address: hotel.address || null,
    amenities: hotel.amenities || [],
    contact: hotel.contact || null,
    images,
    source: "AMADEUS",
  };

  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 21600, // 6 hours
  });

  return result;
}

}

export default new HotelService();
