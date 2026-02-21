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
            if (err?.response?.status === 404) {
            const fallbackPaths = [
                `/review/${restaurantId}`,
                `/review/create/${restaurantId}`,
            ];

            for (const path of fallbackPaths) {
                try {
                    const fallbackResponse = await axiosInstance.post(
                        path,
                        reviewData
                    );
                    return fallbackResponse.data;
                } catch (fallbackErr: Error | any) {
                    if (fallbackErr?.response?.status !== 404) {
                        throw new Error(
                            fallbackErr.response?.data?.message ||
                            fallbackErr.message ||
                            "Creating review failed"
                        );
                    }
                }
            }
        }

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
        if (err?.response?.status === 404) {
            const fallbackAttempts = [
                { method: "put", path: `/review/update/${reviewId}` },
                { method: "patch", path: `/review/${reviewId}` },
                { method: "patch", path: `/review/update/${reviewId}` },
                { method: "put", path: `/review/edit/${reviewId}` },
                { method: "patch", path: `/review/edit/${reviewId}` },
            ] as const;

            for (const attempt of fallbackAttempts) {
                try {
                    const fallbackResponse =
                        attempt.method === "put"
                            ? await axiosInstance.put(attempt.path, reviewData)
                            : await axiosInstance.patch(attempt.path, reviewData);

                    return fallbackResponse.data;
                } catch (fallbackErr: Error | any) {
                    if (fallbackErr?.response?.status !== 404) {
                        throw new Error(
                            fallbackErr.response?.data?.message ||
                            fallbackErr.message ||
                            "Updating review failed"
                        );
                    }
                }
            }
        }

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
        if (err?.response?.status === 404) {
            try {
                const fallbackResponse = await axiosInstance.delete(
                    `/review/delete/${reviewId}`
                );
                return fallbackResponse.data;
            } catch (fallbackErr: Error | any) {
                throw new Error(
                    fallbackErr.response?.data?.message ||
                    fallbackErr.message ||
                    "Deleting review failed"
                );
            }
        }

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Deleting review failed"
        );
    }
};

export const getReviewsForOwner = async () => {
  try {
    const response = await axiosInstance.get(
      API.REVIEW.OWNER.GET_MY
    );

    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Fetching owner reviews failed"
    );
  }
};
