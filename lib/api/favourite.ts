import axiosInstance from "./axios";
import { API } from "./endpoint";

export const getMyFavourites = async () => {
  try {
    const response = await axiosInstance.get(API.FAVOURITE.GET_MY);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (err: any) {
    console.error("Favourites API Error:", {
      status: err.response?.status,
      message: err.response?.data?.message || err.message,
      endpoint: API.FAVOURITE.GET_MY,
    });
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Fetching favourites failed",
    };
  }
};

export const addToFavourite = async (restaurantId: string) => {
  const response = await axiosInstance.post(API.FAVOURITE.ADD(restaurantId));

  return response.data.data;
};

export const removeFromFavourite = async (restaurantId: string) => {
  const response = await axiosInstance.delete(
    API.FAVOURITE.REMOVE(restaurantId),
  );

  return response.data.data;
};
