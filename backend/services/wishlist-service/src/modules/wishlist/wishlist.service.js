import { WISHLIST_MODEL } from "./wishlist.model.js";
import { WISHLISTITEM_MODEL } from "./wishlistItem.model.js";
import axios from "axios";

class WishlistService {
   
async createWishlist(userId, name) {
  try {

    return await WISHLIST_MODEL.create({ userId, name });

  } catch (error) {

    if (error.code === 11000) {
      throw new Error("Wishlist name already exists");
    }

    throw error;
  }
}

async getUserWishlists(userId) {
    return await WISHLIST_MODEL.find({ userId }).sort({ createdAt: -1 });
  }

async removeWishlist(userId, wishlistId) {

  const wishlist = await WISHLIST_MODEL.findOne({
    _id: wishlistId,
    userId
  });

  if (!wishlist) {
    throw new Error("Wishlist not found or access denied");
  }

  await WISHLISTITEM_MODEL.deleteMany({ wishlistId });
  return await WISHLIST_MODEL.findByIdAndDelete(wishlistId);
}  

async addItem(userId, wishlistId, entityId, entityType) {

    const wishlist = await WISHLIST_MODEL.findOne({
      _id: wishlistId,
      userId
    });

    if (!wishlist) {
      throw new Error("Wishlist not found or access denied");
    }

    if (entityType === "hotel") {
      try {

        const response = await axios.get(
          `${process.env.HOTEL_SERVICE_URL}/api/v1/hotel/${entityId}`
        );

        if (!response.data?.success) {
          throw new Error("Hotel not found");
        }

      } catch (error) {

        if (error.response?.status === 404) {
          throw new Error("Hotel not found");
        }

        throw new Error("Hotel service unavailable");
      }
    }

    return await WISHLISTITEM_MODEL.create({
      wishlistId,
      entityId,
      entityType
    });
  }

  async getWishlistItems(userId, wishlistId) {

  const wishlist = await WISHLIST_MODEL.findOne({
    _id: wishlistId,
    userId
  });

  if (!wishlist) {
    throw new Error("Wishlist not found or access denied");
  }

  return await WISHLISTITEM_MODEL.find({ wishlistId });
}

  async removeItem(userId, wishlistItemId) {

  const item = await WISHLISTITEM_MODEL.findById(wishlistItemId);

  if (!item) {
    throw new Error("Item not found");
  }

  const wishlist = await WISHLIST_MODEL.findOne({
    _id: item.wishlistId,
    userId
  });

  if (!wishlist) {
    throw new Error("Access denied");
  }

  return await WISHLISTITEM_MODEL.findByIdAndDelete(wishlistItemId);
}

}

export default new WishlistService();
