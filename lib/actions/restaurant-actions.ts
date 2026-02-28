"use server";

import { revalidatePath } from "next/cache";
import { approveRestaurant, createRestaurant, deleteRestaurant, deleteRestaurantByAdmin, getAdminRestaurants, getAllRestaurants, getMyRestaurant, getRestaurantById, rejectRestaurant, suspendRestaurant, updateRestaurant } from "../api/restaurant";


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
  // try {
  //   const res = await createRestaurant(formData);

  //   if (res.success) {
  //     revalidatePath("/"); // refresh homepage
  //     revalidatePath("/restaurantowner/profile"); // refresh owner dashboard

  //     return {
  //       success: true,
  //       data: res.data,
  //       message: "Restaurant created successfully"
  //     };
  //   }

  //   return { success: false, message: res.message || "Creation failed" };

  // } catch (err: Error | any) {
  //   return { success: false, message: err.message || "Creation failed" };
  // }

  try {
      const res = await createRestaurant(formData);
      if (res.success) {
        revalidatePath("/restaurantowner/profile");
        return {
          success: true,
          data: res.data,
          message: "Registration successful",
        };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (err: Error | any) {
      return { success: false, message: err.message || "Registration failed" };
    }
};


// Update restaurant
export const handleUpdateRestaurant = async (formData: FormData) => {
  try {
    const res = await updateRestaurant(formData);

    if (res.success) {
      revalidatePath("/");
      revalidatePath("/restaurantowner/dashboard");

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


export const handleGetAdminRestaurants = async () => {
  try {
    const res = await getAdminRestaurants();
    return res.success 
      ? { success: true, data: res.data } 
      : { success: false, message: res.message || "Failed to fetch admin list" };
  } catch (err: any) {
    return { success: false, message: err.message || "Server error fetching admin list" };
  }
};

// Approve restaurant
export const handleApproveRestaurant = async (id: string) => {
  try {
    const res = await approveRestaurant(id);
    if (res.success) {
      revalidatePath("/admin/approvals");
      return { success: true, message: "Restaurant approved successfully" };
    }
    return { success: false, message: res.message || "Approval failed" };
  } catch (err: any) {
    return { success: false, message: err.message || "Approval error" };
  }
};

// Reject restaurant
export const handleRejectRestaurant = async (id: string) => {
  try {
    const res = await rejectRestaurant(id);
    if (res.success) {
      revalidatePath("/admin/approvals");
      return { success: true, message: "Restaurant rejected" };
    }
    return { success: false, message: res.message || "Rejection failed" };
  } catch (err: any) {
    return { success: false, message: err.message || "Rejection error" };
  }
};

// Suspend restaurant
export const handleSuspendRestaurant = async (id: string) => {
  try {
    const res = await suspendRestaurant(id);
    if (res.success) {
      revalidatePath("/admin/approvals");
      return { success: true, message: "Restaurant suspended" };
    }
    return { success: false, message: res.message || "Suspension failed" };
  } catch (err: any) {
    return { success: false, message: err.message || "Suspension error" };
  }
};

// Admin-level Delete
export const handleDeleteRestaurantByAdmin = async (id: string) => {
  try {
    const res = await deleteRestaurantByAdmin(id);
    if (res.success) {
      revalidatePath("/admin/approvals");
      return { success: true, message: "Restaurant deleted by admin" };
    }
    return { success: false, message: res.message || "Deletion failed" };
  } catch (err: any) {
    return { success: false, message: err.message || "Deletion error" };
  }
};