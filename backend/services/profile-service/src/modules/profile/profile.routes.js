import { Router } from 'express';
import ProfileController from './profile.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = Router();
const profileController = new ProfileController();

router.get("/me", authenticate, profileController.getProfile);
router.patch("/general", authenticate, profileController.updateGeneral);
router.patch("/contact", authenticate, profileController.updateContact);
router.patch("/documents", authenticate, profileController.updateDocuments);
router.patch("/travel-preferences",authenticate, profileController.updateTravelPreferences);

// Frequent Flyer APIs
router.post("/frequent-flyer", authenticate, profileController.addFrequentFlyer);
router.delete("/frequent-flyer/:id", authenticate, profileController.deleteFrequentFlyer);

router.post("/logout", authenticate, profileController.logout);

export default router;