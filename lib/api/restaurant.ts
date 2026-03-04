import axiosInstance from "./axios";
import { API } from "./endpoint";

export const getAllRestaurants = async () => {
  try {
    const response = await axiosInstance.get(API.RESTAURANT.GET_ALL);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Fetching restaurants failed",
    );
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.RESTAURANT.GET_ONE(id));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Fetching restaurant failed",
    );
  }
};

export const getMyRestaurant = async () => {
  try {
    const response = await axiosInstance.get(API.RESTAURANT.OWNER.GET_MY);
    return response.data;
  } catch (err: Error | any) {
    const status = err?.response?.status;
    return {
      success: false,
      message:
        err.response?.data?.message ||
        (status ? `Request failed with status code ${status}` : err.message) ||
        "Get My Restaurant failed",
      data: null,
    };
  }
};

export const createRestaurant = async (restaurantData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API.RESTAURANT.OWNER.CREATE,
      restaurantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Restaurant Creation failed",
    );
  }
};

export const updateRestaurant = async (restaurantData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.RESTAURANT.OWNER.UPDATE,
      restaurantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Updating restaurant failed",
    );
  }
};

export const deleteRestaurant = async () => {
  try {
    const response = await axiosInstance.delete(API.RESTAURANT.OWNER.DELETE);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Deleting restaurant failed",
    );
  }
};

export const getAdminRestaurants = async () => {
  try {
    const response = await axiosInstance.get(API.ADMIN.RESTAURANTS.GET_ALL);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Admin fetch failed");
  }
};

export const approveRestaurant = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      API.ADMIN.RESTAURANTS.APPROVE(id),
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Approval failed");
  }
};

export const rejectRestaurant = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      API.ADMIN.RESTAURANTS.REJECT(id),
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Rejection failed");
  }
};

export const suspendRestaurant = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      API.ADMIN.RESTAURANTS.SUSPEND(id),
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Suspension failed");
  }
};

export const deleteRestaurantByAdmin = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      API.ADMIN.RESTAURANTS.DELETE(id),
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Admin deletion failed");
  }
};
