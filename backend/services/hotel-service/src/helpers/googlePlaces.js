import axios from "axios";

const getHotelImages = async ({ hotelName, city, limit = 5 }) => {
  try {
    const placeId = await getPlaceId(hotelName, city);
    if (!placeId) return [];

    const photoRefs = await getPhotoReferences(placeId, limit);
    if (!photoRefs.length) return [];

    return photoRefs.map(buildPhotoUrl);
  } catch (err) {
    return [];
  }
};

const getPlaceId = async (hotelName, city) => {
  const res = await axios.get(
    `${process.env.GOOGLE_PLACES_BASE_URL}/findplacefromtext/json`,
    {
      params: {
        input: `${hotelName} ${city}`,
        inputtype: "textquery",
        fields: "place_id",
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    }
  );

  return res.data?.candidates?.[0]?.place_id || null;
};

const getPhotoReferences = async (placeId, limit) => {
  const res = await axios.get(
    `${process.env.GOOGLE_PLACES_BASE_URL}/details/json`,
    {
      params: {
        place_id: placeId,
        fields: "photos",
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    }
  );

  const photos = res.data?.result?.photos || [];
  return photos.slice(0, limit).map(p => p.photo_reference);
};

const buildPhotoUrl = (photoReference) => {
  return `${process.env.GOOGLE_PLACES_BASE_URL}/photo?maxwidth=1200&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
};

export default getHotelImages;