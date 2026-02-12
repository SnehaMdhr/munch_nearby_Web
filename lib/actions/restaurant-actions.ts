"use server";

import { revalidatePath } from "next/cache";
import { createRestaurant, deleteRestaurant, getAllRestaurants, getMyRestaurant, getRestaurantById, updateRestaurant } from "../api/restaurant";


// Get all restaurants
export const handleGetAllRestaurants = async () => {
  try {
    const res = await getAllRestaurants();

    if (res.success) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false, message: res.message || "Failed to fetch restaurants" };

  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch restaurants" };
  }
};


// Get restaurant by ID
export const handleGetRestaurantById = async (id: string) => {
  try {
    const res = await getRestaurantById(id);

    if (res.success) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false, message: res.message || "Failed to fetch restaurant" };

  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to fetch restaurant" };
  }
};

// Get my restaurant
export const handleGetMyRestaurant = async () => {
  try {
          const res = await getMyRestaurant();
          if (res.success) {
              return {
                  success: true,
                  data: res.data,
              };
          }
          return { success: false, message: res.message || "Get My Restaurant failed" };
      }catch (err: Error | any) {
          return { success: false, message: err.message || "Get My Restaurant failed" };
      }
};


// Create restaurant
export const handleCreateRestaurant = async (formData: FormData) => {
  try {
    const res = await createRestaurant(formData);

    if (res.success) {
      revalidatePath("/"); // refresh homepage
      revalidatePath("/restaurantowner/profile"); // refresh owner dashboard

      return {
        success: true,
        data: res.data,
        message: "Restaurant created successfully"
      };
    }

    return { success: false, message: res.message || "Creation failed" };

  } catch (err: Error | any) {
    return { success: false, message: err.message || "Creation failed" };
  }
};


// Update restaurant
export const handleUpdateRestaurant = async (restaurantId: string, formData: FormData) => {
  try {
    const res = await updateRestaurant(formData);

    if (res.success) {
      revalidatePath("/");
      revalidatePath("/restaurantowner/profile");

      return {
        success: true,
        data: res.data,
        message: "Restaurant updated successfully"
      };
    }

    return { success: false, message: res.message || "Update failed" };

  } catch (err: Error | any) {
    return { success: false, message: err.message || "Update failed" };
  }
};


// Delete restaurant
export const handleDeleteRestaurant = async () => {
  try {
    const res = await deleteRestaurant();

    if (res.success) {
      revalidatePath("/");
      revalidatePath("/restaurantowner/dashboard");

      return {
        success: true,
        message: "Restaurant deleted successfully"
      };
    }

    return { success: false, message: res.message || "Delete failed" };

  } catch (err: Error | any) {
    return { success: false, message: err.message || "Delete failed" };
  }
};
