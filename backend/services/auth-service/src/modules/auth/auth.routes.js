import { Router } from 'express';
import AuthController from './auth.controller.js';

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/set-password", authController.setPassword);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOtp);

export default router;
