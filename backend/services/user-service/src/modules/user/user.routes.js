import { Router } from 'express';
import UserController from './user.controller.js';
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import internalAuth from '../../middlewares/internalAuth.js';

const router = Router();
const userController = new UserController();

router.post("/create", internalAuth, userController.create);  // create (used only by auth-service)
router.get("/email/:email", internalAuth, userController.getByEmail);  // INTERNAL (auth-service)

router.get("/", userController.getAll);
router.patch("/update-otp-status", internalAuth, userController.updateOtpStatus);
router.patch( "/set-password", internalAuth, userController.setPassword);
router.patch("/update-otp", internalAuth, userController.updateOtp);

export default router;
