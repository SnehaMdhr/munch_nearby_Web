import axiosInstance from "./axios";
import { API } from "./endpoint";


/* ---------------- GET REVIEWS BY RESTAURANT ---------------- */

export const getReviewsByRestaurant = async (restaurantId: string) => {
    try {
        const response = await axiosInstance.get(
            API.REVIEW.GET_BY_RESTAURANT(restaurantId)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Fetching reviews failed"
        );
    }
};


/* ---------------- CREATE REVIEW ---------------- */

export const createReview = async (
    restaurantId: string,
    reviewData: {
        rating: number;
        comment: string;
    }
) => {
    try {
        const response = await axiosInstance.post(
            API.REVIEW.CREATE(restaurantId),
            reviewData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Creating review failed"
        );
    }
};


/* ---------------- UPDATE REVIEW ---------------- */

export const updateReview = async (
    reviewId: string,
    reviewData: {
        rating?: number;
        comment?: string;
    }
) => {
    try {
        const response = await axiosInstance.put(
            API.REVIEW.UPDATE(reviewId),
            reviewData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Updating review failed"
        );
    }
};


/* ---------------- DELETE REVIEW ---------------- */

export const deleteReview = async (reviewId: string) => {
    try {
        const response = await axiosInstance.delete(
            API.REVIEW.DELETE(reviewId)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Deleting review failed"
        );
    }
};
