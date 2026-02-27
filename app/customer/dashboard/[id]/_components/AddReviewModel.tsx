"use client";

import { useState } from "react";
import { handleCreateReview } from "@/lib/actions/review-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      toast.success("Review Added successfully!");
      onClose();
    } else {
      setError(res.message || "Failed to create review");
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-orange-100 p-8 animate-scaleIn">
        {/* Header with Cross Symbol */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800">
              Add <span className="text-orange-500">Review</span>
            </h2>
            <p className="text-sm text-slate-500">
              Share your experience with the community.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <section className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center">
            <label className="text-sm font-bold text-slate-700 mb-3">
              How was your meal?
            </label>
            <div className="flex gap-2 text-4xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    star <= (hover || rating)
                      ? "text-orange-500"
                      : "text-orange-200"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-xs font-bold text-orange-600">
                {rating === 5
                  ? "Excellent!"
                  : rating === 1
                    ? "Disappointing"
                    : "Good"}
              </p>
            )}
          </section>

          {/* Comment Area */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your review here..."
              className="w-full rounded-xl border-2 border-orange-50 px-4 py-3 text-sm focus:border-orange-400 outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <p className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
