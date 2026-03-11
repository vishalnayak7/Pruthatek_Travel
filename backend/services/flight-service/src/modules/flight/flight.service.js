import axios from "axios";
import { getAmadeusToken } from "../../helpers/amadeus.js";

class FlightService {
  async searchFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  adults = 1,
  travelClass = "ECONOMY"
}) {

  const token = await getAmadeusToken();

  const response = await axios.get(
    `${process.env.AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        ...(returnDate && { returnDate }),
        adults,
        travelClass,
        currencyCode: "INR",
        max: 20
      }
    }
  );

  const rawOffers = response.data?.data || [];

  return rawOffers.map((offer) => ({
    offerId: offer.id,

    price: {
      total: offer.price?.total,
      currency: offer.price?.currency
    },

    itineraries: (offer.itineraries || []).map((itinerary) => ({
      duration: itinerary.duration,
      stops: itinerary.segments?.length - 1 || 0,
      segments: (itinerary.segments || []).map((segment) => ({
        from: segment.departure?.iataCode,
        to: segment.arrival?.iataCode,
        departureTime: segment.departure?.at,
        arrivalTime: segment.arrival?.at,
        carrierCode: segment.carrierCode,
        flightNumber: segment.number,
        aircraft: segment.aircraft?.code,
        duration: segment.duration
      }))
    })),

    travelerPricings: offer.travelerPricings,

    rawOffer: offer,

    source: "AMADEUS"
  }));
}

async priceFlight(offer) {
  try {
    const token = await getAmadeusToken();

    const response = await axios.post(
      `${process.env.AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing`,
      {
        data: {
          type: "flight-offers-pricing",
          flightOffers: [offer]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const pricedOffer = response.data?.data?.flightOffers?.[0];

    if (!pricedOffer) {
      throw new Error("Invalid pricing response from Amadeus");
    }

    return {
      offerId: pricedOffer.id,

      price: {
        total: pricedOffer.price?.total,
        base: pricedOffer.price?.base,
        currency: pricedOffer.price?.currency,
        grandTotal: pricedOffer.price?.grandTotal
      },

      itineraries: pricedOffer.itineraries || [],

      travelerPricings: pricedOffer.travelerPricings || [],

      rawOffer: pricedOffer
    };

  } catch (error) {
    console.error(
      "Amadeus Pricing Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

}

export default new FlightService();