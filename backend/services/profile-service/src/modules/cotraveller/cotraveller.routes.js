import { Router } from 'express';
import CotravellerController from './cotraveller.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const cotravellerController = new CotravellerController();

router.get('/', cotravellerController.getAll);

export default router;
