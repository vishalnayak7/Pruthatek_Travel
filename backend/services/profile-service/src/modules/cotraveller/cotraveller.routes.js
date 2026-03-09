import { Router } from 'express';
import CotravellerController from './cotraveller.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = Router();
const cotravellerController = new CotravellerController();

router.post("/", authenticate, cotravellerController.create);
router.get("/", authenticate, cotravellerController.getAll);
router.patch("/:id", authenticate, cotravellerController.update);
router.delete("/:id", authenticate, cotravellerController.delete);


export default router;