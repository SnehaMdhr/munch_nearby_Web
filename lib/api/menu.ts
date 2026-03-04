import axiosInstance from "./axios";
import { API } from "./endpoint";

export const getAllMenus = async () => {
  try {
    const response = await axiosInstance.get(API.MENU.GET_ALL);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Fetching menus failed",
    );
  }
};

export const getMenuById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.MENU.GET_ONE(id));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Fetching menu failed",
    );
  }
};

export const getMenusByRestaurant = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(
      API.MENU.GET_BY_RESTAURANT(restaurantId),
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Fetching restaurant menus failed",
    );
  }
};

export const createMenu = async (menuData: FormData | object) => {
  try {
    const response = await axiosInstance.post(API.MENU.OWNER.CREATE, menuData, {
      headers:
        menuData instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Menu creation failed",
    );
  }
};

export const updateMenu = async (id: string, menuData: FormData | object) => {
  try {
    const response = await axiosInstance.put(
      API.MENU.OWNER.UPDATE(id),
      menuData,
      {
        headers:
          menuData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      },
    );

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Menu update failed",
    );
  }
};

export const deleteMenu = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.MENU.OWNER.DELETE(id));

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Menu delete failed",
    );
  }
};

export const adminDeleteMenu = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.MENUS.DELETE(id));

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Admin menu delete failed",
    );
  }
};
