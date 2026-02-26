"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateReview } from "@/lib/actions/review-actions";

interface Props {
  restaurantId: string;
  reviewId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRating: number;
  initialComment: string;
}

export default function UpdateReviewModal({
  restaurantId,
  reviewId,
  isOpen,
  onClose,
  onSuccess,
  initialRating,
  initialComment,
}: Props) {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill values
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen || !reviewId) return null;

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

    const res = await handleUpdateReview(reviewId, restaurantId, {
      rating,
      comment,
    });

    if (res.success) {
      router.refresh(); // refresh page
      onSuccess();
      onClose();
    } else {
      setError(res.message || "Update failed");
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Update Review</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block font-medium mb-3">Rating</label>

            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition ${
                    star <= (hover || rating)
                      ? "text-[#E87A5D]"
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
            <label className="block font-medium mb-2">Comment</label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-gray-200 p-4 focus:ring-2 focus:ring-[#E87A5D]/30 focus:border-[#E87A5D] outline-none transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl  text-white text-xs font-semibold transition shadow-sm
                               bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                               hover:opacity-90"
            >
              {saving ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
