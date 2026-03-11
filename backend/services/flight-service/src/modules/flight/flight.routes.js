import { Router } from 'express';
import FlightController from './flight.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const flightController = new FlightController();

router.get("/search", flightController.search);
router.post("/pricing", flightController.price);

export default router;
