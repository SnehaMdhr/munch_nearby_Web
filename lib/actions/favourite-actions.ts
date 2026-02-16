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
    const data = await getMyFavourites(); // already pure array
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
