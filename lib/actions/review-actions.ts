"use server";

import { revalidatePath } from "next/cache";
import {
  getReviewsByRestaurant,
  createReview,
  updateReview,
  deleteReview,
  getReviewsForOwner,
  adminDeleteReview,
} from "../api/review";
export const handleGetReviewsByRestaurant = async (restaurantId: string) => {
  try {
    const res = await getReviewsByRestaurant(restaurantId);

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch reviews",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Failed to fetch reviews",
    };
  }
};

export const handleCreateReview = async (
  restaurantId: string,
  reviewData: {
    rating: number;
    comment: string;
  },
) => {
  try {
    const res = await createReview(restaurantId, reviewData);

    if (res.success) {
      revalidatePath(`/customer/dashboard/${restaurantId}`);
      revalidatePath(`/customer/dashboard/${restaurantId}/reviews`);

      return {
        success: true,
        data: res.data,
        message: "Review added successfully",
      };
    }

    return {
      success: false,
      message: res.message || "Creating review failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Creating review failed",
    };
  }
};

export const handleUpdateReview = async (
  reviewId: string,
  restaurantId: string,
  reviewData: {
    rating?: number;
    comment?: string;
  },
) => {
  try {
    const res = await updateReview(reviewId, reviewData);

    if (res.success) {
      revalidatePath(`/customer/dashboard/${restaurantId}`);
      revalidatePath(`/customer/dashboard/${restaurantId}/reviews`);

      return {
        success: true,
        data: res.data,
        message: "Review updated successfully",
      };
    }

    return {
      success: false,
      message: res.message || "Updating review failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Updating review failed",
    };
  }
};

export const handleDeleteReview = async (
  reviewId: string,
  restaurantId: string,
) => {
  try {
    const res = await deleteReview(reviewId);

    if (res.success) {
      revalidatePath(`/customer/dashboard/${restaurantId}`);
      revalidatePath(`/customer/dashboard/${restaurantId}/reviews`);

      return {
        success: true,
        message: "Review deleted successfully",
      };
    }

    return {
      success: false,
      message: res.message || "Deleting review failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Deleting review failed",
    };
  }
};

export const handleGetReviewsForOwner = async () => {
  try {
    const res = await getReviewsForOwner();

    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch owner reviews",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Failed to fetch owner reviews",
    };
  }
};

export const handleAdminDeleteReview = async (reviewId: string) => {
  try {
    const res = await adminDeleteReview(reviewId);

    if (res.success) {
      revalidatePath("/admin/dashboard");

      return {
        success: true,
        message: "Review deleted successfully",
      };
    }

    return {
      success: false,
      message: res.message || "Deleting review failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Deleting review failed",
    };
  }
};
