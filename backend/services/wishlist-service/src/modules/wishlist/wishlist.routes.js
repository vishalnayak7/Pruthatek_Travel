import { Router } from 'express';
import WishlistController from './wishlist.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import authenticate from '../../middlewares/authenticate.js';

const router = Router();
const wishlistController = new WishlistController();

router.post("/", authenticate, wishlistController.createWishlist);
router.get("/", authenticate, wishlistController.getAll);
router.delete("/:id", authenticate, wishlistController.removeWishlist);

router.post("/items", authenticate, wishlistController.addItem);
router.get("/:id/items", authenticate, wishlistController.getWishlistItems);
router.delete("/items/:id", authenticate, wishlistController.removeItem);


export default router;
