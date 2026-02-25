import { Router } from 'express';
import Corporate_authController from './corporate_auth.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const corporate_authController = new Corporate_authController();

router.post("/send-email-otp", corporate_authController.sendEmailOtp);
router.post("/verify-email-otp", corporate_authController.verifyEmailOtp);
router.patch("/complete-profile", corporate_authController.completeProfile);
router.patch("/set-password", corporate_authController.setPassword);
router.post("/login", corporate_authController.login);

router.post("/forgot-password", corporate_authController.forgotPassword);
router.post("/reset-password", corporate_authController.resetPassword);

export default router;
