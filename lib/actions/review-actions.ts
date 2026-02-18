"use server";

import { revalidatePath } from "next/cache";
import {
  getReviewsByRestaurant,
  createReview,
  updateReview,
  deleteReview,
} from "../api/review";


/* ---------------- GET REVIEWS BY RESTAURANT ---------------- */

export const handleGetReviewsByRestaurant = async (
  restaurantId: string
) => {
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


/* ---------------- CREATE REVIEW ---------------- */

export const handleCreateReview = async (
  restaurantId: string,
  reviewData: {
    rating: number;
    comment: string;
  }
) => {
  try {
    const res = await createReview(restaurantId, reviewData);

    if (res.success) {
      // Revalidate restaurant page
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


/* ---------------- UPDATE REVIEW ---------------- */

export const handleUpdateReview = async (
  reviewId: string,
  restaurantId: string,
  reviewData: {
    rating?: number;
    comment?: string;
  }
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


/* ---------------- DELETE REVIEW ---------------- */

export const handleDeleteReview = async (
  reviewId: string,
  restaurantId: string
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
