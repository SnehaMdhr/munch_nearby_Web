"use server";

import { revalidatePath } from "next/cache";
import {
  getAllMenus,
  getMenuById,
  getMenusByRestaurant,
  createMenu,
  updateMenu,
  deleteMenu
} from "../api/menu";


// ✅ Get all menus
export const handleGetAllMenus = async () => {
  try {
    const res = await getAllMenus();

    if (res.success) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false, message: res.message || "Failed to fetch menus" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch menus" };
  }
};


// ✅ Get menu by ID
export const handleGetMenuById = async (id: string) => {
  try {
    const res = await getMenuById(id);

    if (res.success) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false, message: res.message || "Failed to fetch menu" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch menu" };
  }
};


// ✅ Get menus by restaurant
export const handleGetMenusByRestaurant = async (restaurantId: string) => {
  try {
    const res = await getMenusByRestaurant(restaurantId);

    if (res.success) {
      return {
        success: true,
        data: res.data
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch restaurant menus"
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Failed to fetch restaurant menus"
    };
  }
};


// ✅ Create menu
export const handleCreateMenu = async (formData: FormData) => {
  try {
    const res = await createMenu(formData);

    if (res.success) {
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        data: res.data,
        message: "Menu created successfully"
      };
    }

    return { success: false, message: res.message || "Creation failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Creation failed" };
  }
};


// ✅ Update menu
export const handleUpdateMenu = async (id: string, formData: FormData) => {
  try {
    const res = await updateMenu(id, formData);

    if (res.success) {
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        data: res.data,
        message: "Menu updated successfully"
      };
    }

    return { success: false, message: res.message || "Update failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Update failed" };
  }
};


// ✅ Delete menu
export const handleDeleteMenu = async (id: string) => {
  try {
    const res = await deleteMenu(id);

    if (res.success) {
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        message: "Menu deleted successfully"
      };
    }

    return { success: false, message: res.message || "Delete failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Delete failed" };
  }
};
