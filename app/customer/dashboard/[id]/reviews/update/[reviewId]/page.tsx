"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/customer/_components/SideBar";
import { handleUpdateReview } from "@/lib/actions/review-actions";
import { handleGetReviewsByRestaurant } from "@/lib/actions/review-actions";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.id as string;
  const reviewId = params.reviewId as string;

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH EXISTING REVIEW ---------------- */

  useEffect(() => {
    const fetchReview = async () => {
      const res = await handleGetReviewsByRestaurant(restaurantId);

      if (res.success) {
        const review = res.data.find(
          (r: any) => r._id === reviewId
        );

        if (review) {
          setRating(
            typeof review.rating === "number"
              ? review.rating
              : Number(review.rating)
          );
          setComment(review.comment || "");
        } else {
          setError("Review not found");
        }
      } else {
        setError("Failed to load review");
      }

      setLoading(false);
    };

    fetchReview();
  }, [restaurantId, reviewId]);

  /* ---------------- UPDATE HANDLER ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setSaving(true);
    setError(null);

    const res = await handleUpdateReview(
      reviewId,
      restaurantId,
      { rating, comment }
    );

    if (res.success) {
      router.push(
        `/customer/dashboard/${restaurantId}/reviews`
      );
    } else {
      setError(res.message || "Update failed");
    }

    setSaving(false);
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6">Loading review...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Update Review
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 space-y-6"
        >
          {/* Rating */}
          <div>
            <label className="block font-medium mb-2">
              Rating
            </label>

            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition ${
                    star <= (hover || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-medium mb-2">
              Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Review"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/customer/dashboard/${restaurantId}/reviews`
                )
              }
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
