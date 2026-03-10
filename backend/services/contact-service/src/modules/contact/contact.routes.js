import { Router } from 'express';
import ContactController from './contact.controller.js';

const router = Router();
const contactController = new ContactController();

router.post("/contact-info", contactController.saveContactInfo);
router.get("/contact-info", contactController.getContactInfo);
router.post("/send-message", contactController.createMessage);
router.get("/messages", contactController.getMessages);

export default router;
