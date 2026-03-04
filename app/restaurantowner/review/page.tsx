"use client";

import { handleGetReviewsForOwner } from "@/lib/actions/review-actions";
import { z } from "zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "../_components/Header";

const resolveImageSrc = (imageValue?: string) => {
  if (!imageValue) return null;

  const normalizedPath = imageValue.replace(/\\/g, "/");
  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    return normalizedPath;
  }

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";

  if (!apiBase) return normalizedPath;

  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const path = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${base}${path}`;
};

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
        imageUrl: z.string().optional(),
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
        imageUrl: z.string().optional(),
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
    imageUrl?: string;
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

    const actorEmail = typeof actor === "string" ? undefined : actor?.email;

    const actorImageUrl =
      typeof actor === "string" ? undefined : actor?.imageUrl;

    const parsedRating =
      typeof review.rating === "number" ? review.rating : Number(review.rating);

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
        imageUrl: actorImageUrl,
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

    const avg =
      total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;

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
    <div className="bg-[#FFF7ED]">
      <Header />

      <div className="p-12 ml-20 mr-20">
        {/* Header */}
        <h1 className="text-3xl font-black text-gray-800">
          My Restaurant <span className="text-orange-500">Reviews</span>
        </h1>
        <p className="text-gray-500 mt-2">
          View and manage feedback from your customers
        </p>

        {loading && <p className="text-gray-500 mt-8">Loading reviews...</p>}

        {!loading && error && <p className="text-red-500 mt-8">{error}</p>}

        {/* Rating Summary */}
        {!loading && !error && totalReviews > 0 && (
          <div className="mt-8 bg-orange-100 p-10 rounded-3xl ml-30 mr-30">
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
                    ratingCounts[star as 1 | 2 | 3 | 4 | 5],
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

                      <span className="w-12 text-sm">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* REVIEW CARDS */}
        {!loading && !error && totalReviews === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-4xl border-2 border-dashed border-gray-200 mt-10">
            <p className="text-gray-400 font-medium">No reviews found yet.</p>
          </div>
        ) : !loading && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-100/50"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100 overflow-hidden">
                      {resolveImageSrc(review.user.imageUrl) ? (
                        <Image
                          src={resolveImageSrc(review.user.imageUrl)!}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 group-hover:text-[#E87A5D] transition-colors leading-tight">
                        {review.user.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex bg-orange-50/50 px-2.5 py-1 rounded-full border border-orange-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= review.rating
                            ? "text-[#E87A5D]"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <p className="text-gray-600 leading-relaxed italic pr-4">
                    {review.comment ? (
                      `"${review.comment}"`
                    ) : (
                      <span className="text-gray-300 not-italic">
                        No comment provided.
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-1 pt-5 border-t border-gray-50 flex justify-between items-center">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
                    Posted on{" "}
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
