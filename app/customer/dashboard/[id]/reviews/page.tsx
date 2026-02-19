"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/customer/_components/SideBar";
import { z } from "zod";
import { handleDeleteReview, handleGetReviewsByRestaurant } from "@/lib/actions/review-actions";
import DeleteModal from "@/app/_components/DeleteModel";
import { useRouter } from "next/navigation";



/* -------------------- ZOD SCHEMA -------------------- */

const RawReviewSchema = z.object({
  _id: z.string(),
  customer: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string().optional(),
    }),
  ]),
  rating: z.union([z.number(), z.string()]),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
});

type RawReview = z.infer<typeof RawReviewSchema>;

type Review = {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* -------------------- FETCH REVIEWS -------------------- */

  useEffect(() => {
    const fetchReviews = async () => {
      if (!restaurantId) return;

      const res = await handleGetReviewsByRestaurant(restaurantId);

      if (res.success) {
        const parsed = z.array(RawReviewSchema).safeParse(res.data);

        if (!parsed.success) {
          console.error("Review parse errors:", parsed.error.format());
          console.error("Received payload:", res.data);
          setError("Invalid reviews data received from server");
        } else {
          const normalized: Review[] = parsed.data.map((r: RawReview) => {
            const ratingNum =
              typeof r.rating === "number" ? r.rating : Number(r.rating);

            const customerName =
              typeof r.customer === "string"
                ? "Anonymous"
                : r.customer.name ?? "Anonymous";

            return {
              _id: r._id,
              customerName,
              rating: isNaN(ratingNum) ? 0 : ratingNum,
              comment: r.comment ?? "",
              createdAt: r.createdAt,
            };
          });

          setReviews(normalized);
        }
      } else {
        setError(res.message || "Failed to fetch reviews");
      }

      setLoading(false);
    };

    fetchReviews();
  }, [restaurantId]);

  /* -------------------- DELETE HANDLERS -------------------- */

  const openDeleteModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(null);
    setSelectedReviewId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReviewId || !restaurantId) return;

    setDeleting(true);

    const res = await handleDeleteReview(
      selectedReviewId,
      restaurantId
    );

    if (res.success) {
      // Remove review from UI instantly
      setReviews((prev) =>
        prev.filter((r) => r._id !== selectedReviewId)
      );
    } else {
      alert(res.message || "Failed to delete review");
    }

    setDeleting(false);
    closeDeleteModal();
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Restaurant Reviews
        </h1>

        <button
          onClick={() => router.push(`/customer/dashboard/${restaurantId}/addreview`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Review
        </button>
      </div>


        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-xl shadow-md p-5 bg-white hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    {review.customerName}
                  </h3>

                  <div className="flex items-center gap-4">
                    {/* Stars */}
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        openDeleteModal(review._id)
                      }
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700">
                  {review.comment}
                </p>

                {/* Date */}
                {review.createdAt && (
                  <p className="text-sm text-gray-500 mt-3">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}
