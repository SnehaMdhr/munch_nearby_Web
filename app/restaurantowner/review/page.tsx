"use client";

import { handleGetReviewsForOwner } from "@/lib/actions/review-actions";
import { z } from "zod";
import Sidebar from "../_components/SideBar";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- ZOD SCHEMA ---------------- */

const RawReviewSchema = z.object({
  _id: z.string(),
  rating: z.union([z.number(), z.string()]),
  comment: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  user: z
    .union([
      z.string(),
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
      }),
    ])
    .optional(),
  customer: z
    .union([
      z.string(),
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
      }),
    ])
    .optional(),
});

const ReviewsArraySchema = z.array(RawReviewSchema);

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email?: string;
  };
};

const normalizeOwnerReviews = (payload: unknown): Review[] | null => {
  const parsed = ReviewsArraySchema.safeParse(payload);

  if (!parsed.success) return null;

  return parsed.data.map((review) => {
    const actor = review.user ?? review.customer;

    const actorName =
      typeof actor === "string"
        ? "Anonymous"
        : actor?.name?.trim() || "Anonymous";

    const actorEmail =
      typeof actor === "string" ? undefined : actor?.email;

    const parsedRating =
      typeof review.rating === "number"
        ? review.rating
        : Number(review.rating);

    const createdAt =
      review.createdAt instanceof Date
        ? review.createdAt.toISOString()
        : review.createdAt || new Date().toISOString();

    return {
      _id: review._id,
      rating: Number.isNaN(parsedRating) ? 0 : parsedRating,
      comment: review.comment ?? "",
      createdAt,
      user: {
        name: actorName,
        email: actorEmail,
      },
    };
  });
};

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerReviews = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const res = await handleGetReviewsForOwner();

      if (!res.success) {
        setError(res.message || "Failed to load reviews");
        return;
      }

      const normalized = normalizeOwnerReviews(res.data);

      if (!normalized) {
        setError("Invalid review data structure");
        return;
      }

      setReviews(normalized);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load reviews");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchOwnerReviews(true);

    const intervalId = window.setInterval(() => {
      fetchOwnerReviews(false);
    }, 10000);

    const handleWindowFocus = () => fetchOwnerReviews(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOwnerReviews(false);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchOwnerReviews]);

  const { totalReviews, ratingCounts, average, averageRating } = useMemo(() => {
    const total = reviews.length;

    const counts: Record<1 | 2 | 3 | 4 | 5, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const rounded = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (counts[rounded] !== undefined) {
        counts[rounded]++;
      }
    });

    const avg = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;

    return {
      totalReviews: total,
      ratingCounts: counts,
      average: avg,
      averageRating: avg.toFixed(1),
    };
  }, [reviews]);

  const getPercentage = (count: number) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Restaurant Reviews
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage reviews for your restaurant
          </p>
        </div>

        {loading && <p className="text-gray-500 mt-8">Loading reviews...</p>}

        {!loading && error && (
          <p className="text-red-500 mt-8">{error}</p>
        )}

        {/* Rating Summary */}
        {!loading && !error && totalReviews > 0 && (
          <div className="mt-8 bg-linear-to-r from-orange-100 to-orange-50 p-10 rounded-3xl w-full">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left */}
              <div>
                <div className="text-6xl font-bold text-gray-800">
                  {averageRating}
                </div>

                <div className="flex mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= Math.round(average)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mt-3">
                  Based on {totalReviews} review
                  {totalReviews > 1 && "s"}
                </p>
              </div>

              {/* Breakdown */}
              <div className="flex-1 space-y-4">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = getPercentage(
                    ratingCounts[star as 1 | 2 | 3 | 4 | 5]
                  );

                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="w-4 font-medium">{star}</span>

                      <div className="flex-1 bg-gray-300 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="w-12 text-sm">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* REVIEW CARDS */}
        {!loading && !error && totalReviews === 0 ? (
          <p className="text-gray-500 mt-8">No reviews yet.</p>
        ) : !loading && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6 border border-[#E87A5D]/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {review.user.name}
                  </h2>

                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= review.rating
                            ? "text-[#E87A5D]"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600">
                  {review.comment || "No comment provided."}
                </p>

                <p className="text-xs text-gray-400 mt-4">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}