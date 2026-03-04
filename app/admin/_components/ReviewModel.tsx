"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  handleGetReviewsByRestaurant,
  handleAdminDeleteReview,
} from "@/lib/actions/review-actions";
import DeleteModal from "@/app/_components/DeleteModel";

interface Review {
  _id: string;
  customer: {
    name: string;
    email: string;
    imageUrl?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

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
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const path = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;
  return `${base}${path}`;
};

export default function ReviewModal({
  open,
  onClose,
  restaurantId,
}: {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await handleGetReviewsByRestaurant(restaurantId);

    if (res.success) setReviews(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open && restaurantId) fetchReviews();
  }, [open, restaurantId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const res = await handleAdminDeleteReview(deleteTarget);

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget));
      toast.success("Review deleted");
    } else {
      toast.error(res.message);
    }

    setDeleteTarget(null);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
        <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="mb-4">
              <h2 className="text-3xl font-black text-gray-800">
                Restaurant <span className="text-[#E87A5D]">Reviews</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Manage customer feedback.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Loading / No Reviews */}
          {loading && <p className="text-gray-500">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-gray-400 text-center py-20">
              No reviews available.
            </p>
          )}

          {/* Reviews Grid */}
          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTarget(review._id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold border overflow-hidden">
                      {review.customer.imageUrl ? (
                        <Image
                          src={resolveImageSrc(review.customer.imageUrl)!}
                          alt={review.customer.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.customer.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#E87A5D] transition-colors">
                        {review.customer.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {review.customer.email}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i <= review.rating
                            ? "text-[#E87A5D]"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 leading-relaxed italic mb-4">
                    {review.comment || (
                      <span className="text-gray-300 not-italic">
                        No comment provided.
                      </span>
                    )}
                  </p>

                  {/* Date */}
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
                    Posted on{" "}
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review?"
      />
    </>
  );
}
