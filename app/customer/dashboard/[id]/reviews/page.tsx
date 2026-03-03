"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import {
  handleDeleteReview,
  handleGetReviewsByRestaurant,
} from "@/lib/actions/review-actions";
import DeleteModal from "@/app/_components/DeleteModel";
import { useAuth } from "@/context/AuthContext";
import AddReviewModel from "../_components/AddReviewModel";
import UpdateReviewModel from "../_components/UpdateReviewModel";
import Image from "next/image";

/* -------------------- ZOD SCHEMA -------------------- */

const RawReviewSchema = z.object({
  _id: z.string(),
  customer: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string().optional(),
      imageUrl: z.string().optional(),
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
  customerImageUrl?: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

/* ---------------- helpers ---------------- */

const resolveImageSrc = (imageValue?: string) => {
  if (!imageValue) return null;
  const normalizedPath = imageValue.replace(/\\/g, "/");
  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  )
    return normalizedPath;
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

/* -------------------- PAGE COMPONENT -------------------- */

export default function Page() {
  const params = useParams();
  const { user } = useAuth();

  const restaurantId = typeof params?.id === "string" ? params.id : "";
  const loggedInUserId = user?._id || user?.id || null;

  const [open, setOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  /* -------------------- FETCH REVIEWS -------------------- */
  const fetchReviews = useCallback(async () => {
    if (!restaurantId) return;
    try {
      const res = await handleGetReviewsByRestaurant(restaurantId);
      if (!res.success) {
        setError(res.message || "Failed to fetch reviews");
        return;
      }
      const parsed = z.array(RawReviewSchema).safeParse(res.data);
      if (!parsed.success) {
        setError("Invalid reviews data received from server");
        return;
      }
      const normalized: Review[] = parsed.data.map((r: RawReview) => {
        const ratingNum =
          typeof r.rating === "number" ? r.rating : Number(r.rating);
        const customerId =
          typeof r.customer === "string" ? r.customer : r.customer._id;
        const customerName =
          typeof r.customer === "string"
            ? "Anonymous"
            : (r.customer.name ?? "Anonymous");
        const customerImageUrl =
          typeof r.customer === "string" ? undefined : r.customer.imageUrl;
        return {
          _id: r._id,
          customerId,
          customerName,
          customerImageUrl,
          rating: isNaN(ratingNum) ? 0 : ratingNum,
          comment: r.comment ?? "",
          createdAt: r.createdAt,
        };
      });
      setReviews(normalized);
      setError(null);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    setLoading(true);
    fetchReviews();
  }, [restaurantId, fetchReviews]);

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
    if (!selectedReviewId || !restaurantId) return;
    const res = await handleDeleteReview(selectedReviewId, restaurantId);
    if (res.success)
      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
    else alert(res.message || "Failed to delete review");
    closeDeleteModal();
  };

  /* -------------------- SPLIT REVIEWS -------------------- */
  const myReviews = useMemo(
    () =>
      reviews.filter((r) => loggedInUserId && r.customerId === loggedInUserId),
    [reviews, loggedInUserId],
  );
  const otherReviews = useMemo(
    () =>
      reviews.filter((r) => !loggedInUserId || r.customerId !== loggedInUserId),
    [reviews, loggedInUserId],
  );

  /* -------------------- RENDER CARD -------------------- */
  const renderReviewCard = (review: Review, isUserReview = false) => (
    <div
      key={review._id}
      className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-100/50"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start mb-5">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100 overflow-hidden">
            {resolveImageSrc(review.customerImageUrl) ? (
              <Image
                src={resolveImageSrc(review.customerImageUrl)!}
                alt={review.customerName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              review.customerName.charAt(0).toUpperCase()
            )}
          </div>

          <h2 className="font-bold text-gray-900 group-hover:text-[#E87A5D] transition-colors leading-tight">
            {review.customerName}
          </h2>
        </div>

        {/* Right: Rating Badge */}
        <div className="flex bg-orange-50/50 px-2.5 py-1 rounded-full border border-orange-100">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                star <= review.rating ? "text-[#E87A5D]" : "text-gray-200"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Comment */}
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

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-gray-50 flex justify-between items-center">
        {/* Date */}
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
          Posted on{" "}
          {review.createdAt &&
            new Date(review.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
        </p>

        {/* Bottom Right Buttons */}
        {isUserReview && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedReview(review);
                setIsUpdateOpen(true);
              }}
              className="text-sm font-medium text-[#E87A5D] hover:underline"
            >
              Update
            </button>

            <button
              onClick={() => openDeleteModal(review._id)}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-[#FFF7ED]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-black text-gray-800">
          Restaurant <span className="text-orange-500">Reviews</span>
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-xl bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-medium shadow-md hover:scale-105 transition"
        >
          + Add Review
        </button>
        {open && (
          <AddReviewModel
            restaurantId={restaurantId}
            onClose={() => setOpen(false)}
            isOpen={open}
            onSuccess={async () => {
              await fetchReviews();
              setOpen(false);
            }}
          />
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* User Reviews */}
          {myReviews.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Your Review
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myReviews.map((r) => renderReviewCard(r, true))}
              </div>
            </div>
          )}

          {/* Other Reviews */}
          {otherReviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Other Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherReviews.map((r) => renderReviewCard(r))}
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
        onSuccess={async () => {
          await fetchReviews();
          setIsUpdateOpen(false);
        }}
        initialRating={selectedReview?.rating || 0}
        initialComment={selectedReview?.comment || ""}
      />
    </div>
  );
}
