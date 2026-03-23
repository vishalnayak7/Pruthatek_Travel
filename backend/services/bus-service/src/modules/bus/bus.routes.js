import { Router } from 'express';
import BusController from './bus.controller.js';

const router = Router();
const busController = new BusController();

router.get("/search", busController.search);

export default router;
