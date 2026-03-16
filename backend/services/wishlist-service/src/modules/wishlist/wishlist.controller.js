import WishlistService from "./wishlist.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class WishlistController {
  constructor() {
    this.wishlistService = WishlistService;
  }

  createWishlist = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const wishlist = await this.wishlistService.createWishlist(userId, name);

      res.success("Wishlist created successfully", wishlist, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const wishlists = await this.wishlistService.getUserWishlists(userId);

      res.success("Wishlists fetched successfully", wishlists, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  removeWishlist = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const wishlist = await this.wishlistService.removeWishlist(userId, id);

    res.success("Wishlist deleted successfully", wishlist, statusCode.OK);

  } catch (err) {
    next(err);
  }
};

  addItem = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const { wishlistId, entityId, entityType } = req.body;

    const item = await this.wishlistService.addItem(
      userId,
      wishlistId,
      entityId,
      entityType
    );

    res.success("Item added to wishlist", item, statusCode.CREATED);

  } catch (err) {
    next(err);
  }
};

  getWishlistItems = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const items = await this.wishlistService.getWishlistItems(userId, id);

    res.success("Wishlist items fetched successfully", items, statusCode.OK);

  } catch (err) {
    next(err);
  }
};

  removeItem = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const item = await this.wishlistService.removeItem(userId, id);

    res.success("Item removed from wishlist", item, statusCode.OK);

  } catch (err) {
    next(err);
  }
};

}