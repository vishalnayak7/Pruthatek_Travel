export interface ServicesConfig {
  user?: string;
  auth?: string;
  hotel?: string;
  profile?: string;
  contact?: string;
  flight?: string;
}

export const SERVICES: ServicesConfig = {
  user: process.env.USER_SERVICE_URL,
  auth: process.env.AUTH_SERVICE_URL,
  hotel: process.env.HOTEL_SERVICE_URL,
  profile: process.env.PROFILE_SERVICE_URL,
  contact: process.env.CONTACT_SERVICE_URL,
  flight: process.env.FLIGHT_SERVICE_URL,
};
