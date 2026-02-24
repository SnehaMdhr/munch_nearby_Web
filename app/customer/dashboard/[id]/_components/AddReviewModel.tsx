"use client";

import { useState } from "react";
import { handleCreateReview } from "@/lib/actions/review-actions";
import { useRouter } from "next/navigation";

interface Props {
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReviewModal({
  restaurantId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
    const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

    setLoading(true);
    setError(null);

    const res = await handleCreateReview(restaurantId, {
      rating,
      comment,
    });

    if (res.success) {
        router.refresh();
      onSuccess();
      onClose();
    } else {
      setError(res.message || "Failed to create review");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 animate-scaleIn">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Rating */}
          <div>
            <label className="block font-medium mb-3">
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
            <label className="block font-medium mb-2">
              Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your review here..."
              className="w-full rounded-2xl border border-gray-200 p-4 focus:ring-2 focus:ring-[#E87A5D]/30 focus:border-[#E87A5D] outline-none transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Buttons */}
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
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#E87A5D] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}