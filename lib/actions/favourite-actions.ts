"use server";

import {
  addToFavourite,
  getMyFavourites,
  removeFromFavourite,
} from "../api/favourite";

export const handleAddToFavourite = async (restaurantId: string) => {
  try {
    const data = await addToFavourite(restaurantId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleRemoveFromFavourite = async (restaurantId: string) => {
  try {
    const data = await removeFromFavourite(restaurantId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetMyFavourites = async () => {
  try {
    const res = await getMyFavourites();

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch favourites",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to fetch favourites",
    };
  }
};
