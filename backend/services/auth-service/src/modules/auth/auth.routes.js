import { Router } from 'express';
import AuthController from './auth.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/set-password", authController.setPassword);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOtp);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/google", authController.googleSignIn);

router.post("/logout", authenticate, authController.logout);
router.post("/validate-token", authController.validateToken.bind(authController));

export default router;
