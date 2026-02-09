import { Router } from 'express';
import UserController from './user.controller.js';
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import internalAuth from '../../middlewares/internalAuth.js';

const router = Router();
const userController = new UserController();

router.post("/create", internalAuth, userController.create);  // create (used only by auth-service)
router.get("/email/:email", internalAuth, userController.getByEmail);  // INTERNAL (auth-service)

router.get("/", authenticate, authorize("ADMIN"), userController.getAll);
router.get("/:id", authenticate, authorize("ADMIN"), userController.getById);
router.put("/:id", authenticate, authorize("ADMIN"), userController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), userController.delete);

router.post("/forgot-password", internalAuth, userController.forgotPassword);  // INTERNAL (auth-service)
router.post("/reset-password", internalAuth, userController.resetPassword);  // INTERNAL (auth-service)

router.post("/google-login", internalAuth,userController.googleLogin);  // INTERNAL (auth-service)

export default router;
