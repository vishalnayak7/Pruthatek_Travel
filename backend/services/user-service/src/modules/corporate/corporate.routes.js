import { Router } from "express";
import CorporateController from "./corporate.controller.js";
import internalAuth from "../../middlewares/internalAuth.js";

const router = Router();
const controller = new CorporateController();

router.post("/create", internalAuth, controller.create);
router.get("/email/:email", internalAuth, controller.getByEmail);
router.patch("/update-otp", internalAuth, controller.updateOtp);
router.patch("/verify-otp", internalAuth, controller.verifyOtp);
router.patch("/complete-profile", internalAuth, controller.completeProfile);
router.patch("/set-password", internalAuth, controller.setPassword);
router.get("/", controller.getAll);

router.patch("/update-reset-email-otp", internalAuth, controller.updateResetEmailOtp);
router.patch("/reset-password-email", internalAuth, controller.resetPasswordByEmail);

export default router;