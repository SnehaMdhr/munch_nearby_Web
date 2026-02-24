"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import {
  handleDeleteReview,
  handleGetReviewsByRestaurant,
} from "@/lib/actions/review-actions";
import DeleteModal from "@/app/_components/DeleteModel";
import { useAuth } from "@/context/AuthContext";
import AddReviewModel from "../_components/AddReviewModel";
import UpdateReviewModel from "../_components/UpdateReviewModel";

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
  customerId: string | null;
  customerName: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const restaurantId =
    typeof params?.id === "string" ? params.id : "";

  const loggedInUserId =
    user?._id || user?.id || null;

  const [open, setOpen] = useState(false);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
const [selectedReview, setSelectedReview] = useState<any>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  const [selectedReviewId, setSelectedReviewId] =
    useState<string | null>(null);

  /* -------------------- FETCH REVIEWS -------------------- */

  useEffect(() => {
    if (!restaurantId) return;

    const fetchReviews = async () => {
      try {
        const res =
          await handleGetReviewsByRestaurant(
            restaurantId
          );

        if (!res.success) {
          setError(
            res.message || "Failed to fetch reviews"
          );
          return;
        }

        const parsed = z
          .array(RawReviewSchema)
          .safeParse(res.data);

        if (!parsed.success) {
          setError(
            "Invalid reviews data received from server"
          );
          return;
        }

        const normalized: Review[] =
          parsed.data.map((r: RawReview) => {
            const ratingNum =
              typeof r.rating === "number"
                ? r.rating
                : Number(r.rating);

            const customerId =
              typeof r.customer === "string"
                ? r.customer
                : r.customer._id;

            const customerName =
              typeof r.customer === "string"
                ? "Anonymous"
                : r.customer.name ?? "Anonymous";

            return {
              _id: r._id,
              customerId,
              customerName,
              rating: isNaN(ratingNum)
                ? 0
                : ratingNum,
              comment: r.comment ?? "",
              createdAt: r.createdAt,
            };
          });

        setReviews(normalized);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  /* -------------------- DELETE HANDLERS -------------------- */

  const openDeleteModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedReviewId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReviewId || !restaurantId)
      return;

    const res = await handleDeleteReview(
      selectedReviewId,
      restaurantId
    );

    if (res.success) {
      setReviews((prev) =>
        prev.filter(
          (r) => r._id !== selectedReviewId
        )
      );
    } else {
      alert(
        res.message || "Failed to delete review"
      );
    }

    closeDeleteModal();
  };

  /* -------------------- SPLIT REVIEWS -------------------- */

  const myReviews = useMemo(
    () =>
      reviews.filter(
        (r) =>
          loggedInUserId &&
          r.customerId === loggedInUserId
      ),
    [reviews, loggedInUserId]
  );

  const otherReviews = useMemo(
    () =>
      reviews.filter(
        (r) =>
          !loggedInUserId ||
          r.customerId !== loggedInUserId
      ),
    [reviews, loggedInUserId]
  );

  /* -------------------- UI -------------------- */

  return (
  <div className="min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Restaurant Reviews
      </h1>

      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 rounded-xl 
        bg-linear-to-r from-[#E87A5D] to-[#F6B88F] 
        text-white font-medium shadow-md
        hover:scale-105 transition"
      >
        + Add Review
      </button>

      {/* Modal */}
      {open && (
        <AddReviewModel
          restaurantId={restaurantId}
          onClose={() => setOpen(false)}
          isOpen={open}
          onSuccess={() => setOpen(false)}
        />
      )}

    </div>

    {loading ? (
      <p className="text-gray-500">Loading reviews...</p>
    ) : error ? (
      <p className="text-red-600">{error}</p>
    ) : reviews.length === 0 ? (
      <p className="text-gray-500">No reviews found.</p>
    ) : (
      <>
        {/* MY REVIEWS */}
        {myReviews.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1.5 bg-[#E87A5D] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">
                Your Review
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6 border border-[#E87A5D]/20"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {review.customerName}
                    </h3>

                    <div className="flex items-center gap-4">
                      {/* Stars */}
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

                      {/* Update */}
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setIsUpdateOpen(true);
                        }}
                        className="text-sm font-medium text-[#E87A5D] hover:underline"
                      >
                        Update
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          openDeleteModal(review._id)
                        }
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>

                  {review.createdAt && (
                    <p className="text-xs text-gray-400 mt-4">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER REVIEWS */}
        {otherReviews.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1.5 bg-gray-300 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">
                Other Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {review.customerName}
                    </h3>

                    {/* Stars */}
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

                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>

                  {review.createdAt && (
                    <p className="text-xs text-gray-400 mt-4">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}

    <DeleteModal
      isOpen={isDeleteOpen}
      onClose={closeDeleteModal}
      onConfirm={handleConfirmDelete}
      title="Delete Review"
      description="Are you sure you want to delete this review? This action cannot be undone."
    />

    <UpdateReviewModel
      restaurantId={restaurantId}
      reviewId={selectedReview?._id || null}
      isOpen={isUpdateOpen}
      onClose={() => setIsUpdateOpen(false)}
      initialRating={selectedReview?.rating || 0}
      initialComment={selectedReview?.comment || ""}
    />
  </div>
);
}