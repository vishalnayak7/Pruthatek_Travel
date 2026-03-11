import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;

export const getAmadeusToken = async () => {
  if (cachedToken && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  const response = await axios.post(
    `${process.env.AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return cachedToken;
};
