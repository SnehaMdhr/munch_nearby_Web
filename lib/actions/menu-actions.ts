"use server";

import { revalidatePath } from "next/cache";
import {
  getAllMenus,
  getMenuById,
  getMenusByRestaurant,
  createMenu,
  updateMenu,
  deleteMenu,
  adminDeleteMenu,
} from "@/lib/api/menu";

export const handleGetAllMenus = async () => {
  try {
    const res = await getAllMenus();

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false, message: res.message || "Failed to fetch menus" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch menus" };
  }
};

export const handleGetMenuById = async (id: string) => {
  try {
    const res = await getMenuById(id);

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false, message: res.message || "Failed to fetch menu" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch menu" };
  }
};

export const handleGetMenusByRestaurant = async (restaurantId: string) => {
  try {
    const res = await getMenusByRestaurant(restaurantId);

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch restaurant menus",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Failed to fetch restaurant menus",
    };
  }
};

export const handleCreateMenu = async (menuData: FormData | object) => {
  try {
    const res = await createMenu(menuData);

    if (res.success) {
      revalidatePath("/restaurantowner/menu");
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        data: res.data,
        message: "Menu created successfully",
      };
    }

    return { success: false, message: res.message || "Creation failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Creation failed" };
  }
};

export const handleUpdateMenu = async (
  id: string,
  menuData: FormData | object,
) => {
  try {
    const res = await updateMenu(id, menuData);

    if (res.success) {
      revalidatePath("/restaurantowner/menu");
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        data: res.data,
        message: "Menu updated successfully",
      };
    }

    return { success: false, message: res.message || "Update failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Update failed" };
  }
};

export const handleDeleteMenu = async (id: string) => {
  try {
    const res = await deleteMenu(id);
    return {
      success: true,
      data: res?.data ?? res,
      message: res?.message ?? "Menu deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Failed to delete menu",
    };
  }
};

export const handleAdminDeleteMenu = async (id: string) => {
  try {
    const res = await adminDeleteMenu(id);

    if (res.success) {
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/menus");

      return {
        success: true,
        message: "Menu deleted successfully",
      };
    }

    return { success: false, message: res.message || "Delete failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Delete failed" };
  }
};
