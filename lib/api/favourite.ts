import axiosInstance from "./axios";
import { API } from "./endpoint";

// Get My Favourites
export const getMyFavourites = async () => {
  const response = await axiosInstance.get(
    API.FAVOURITE.GET_MY
  );

  // Return ONLY the favourites array
  return response.data.data;
};

// Add To Favourite
export const addToFavourite = async (restaurantId: string) => {
  const response = await axiosInstance.post(
    API.FAVOURITE.ADD(restaurantId)
  );

  return response.data.data;
};

// Remove From Favourite
export const removeFromFavourite = async (restaurantId: string) => {
  const response = await axiosInstance.delete(
    API.FAVOURITE.REMOVE(restaurantId)
  );

  return response.data.data;
};
