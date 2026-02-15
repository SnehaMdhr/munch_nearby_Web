import axiosInstance from "./axios";
import { API } from "./endpoint";


// ✅ Get all menus
export const getAllMenus = async () => {
  try {
    const response = await axiosInstance.get(API.MENU.GET_ALL);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Fetching menus failed"
    );
  }
};


// ✅ Get menu by ID
export const getMenuById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.MENU.GET_ONE(id));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Fetching menu failed"
    );
  }
};


// ✅ Get menus by restaurant
export const getMenusByRestaurant = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(
      API.MENU.GET_BY_RESTAURANT(restaurantId)
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Fetching restaurant menus failed"
    );
  }
};


// ✅ Create menu
export const createMenu = async (menuData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API.MENU.OWNER.CREATE,
      menuData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Menu creation failed"
    );
  }
};


// ✅ Update menu
export const updateMenu = async (id: string, menuData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.MENU.OWNER.UPDATE(id),
      menuData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Menu update failed"
    );
  }
};


// ✅ Delete menu
export const deleteMenu = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      API.MENU.OWNER.DELETE(id)
    );

    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Menu delete failed"
    );
  }
};
