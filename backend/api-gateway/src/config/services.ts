export interface ServicesConfig {
  user?: string;
  auth?: string;
}

export const SERVICES: ServicesConfig = {
  user: process.env.USER_SERVICE_URL,
  auth: process.env.AUTH_SERVICE_URL,
};
