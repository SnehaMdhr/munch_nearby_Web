import axiosInstance from "./axios";
import { API } from "./endpoint";

// Get My Favourites
export const getMyFavourites = async () => {
  try {
    const response = await axiosInstance.get(API.FAVOURITE.GET_MY);

    return {
      success: true,
      data: response.data.data, // ✅ adjust if your backend differs
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Fetching favourites failed",
    };
  }
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
