import { handleGetReviewsForOwner } from "@/lib/actions/review-actions";
import { z } from "zod";
import Sidebar from "../_components/SideBar";

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

const OwnerReviewsResponseSchema = z.union([
  ReviewsArraySchema,
  z.object({ reviews: ReviewsArraySchema }),
  z.object({ data: ReviewsArraySchema }),
  z.object({ data: z.object({ reviews: ReviewsArraySchema }) }),
]);

const normalizeOwnerReviews = (payload: unknown): Review[] | null => {
  const parsedPayload = OwnerReviewsResponseSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return null;
  }

  const data = parsedPayload.data;
  const rawReviews = Array.isArray(data)
    ? data
    : "reviews" in data
      ? data.reviews
      : Array.isArray(data.data)
        ? data.data
        : data.data.reviews;

  return rawReviews.map((review) => {
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
        : review.createdAt || new Date(0).toISOString();

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

export default async function Page() {
  const res = await handleGetReviewsForOwner();

  if (!res.success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Restaurant Reviews</h1>
        <p className="text-red-500">
          {res.message || "Failed to load reviews"}
        </p>
      </div>
    );
  }

  /* ---------------- SAFE PARSE ---------------- */

  const reviews = normalizeOwnerReviews(res.data);

  if (!reviews) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Restaurant Reviews</h1>
        <p className="text-red-500">
          Invalid review data structure.
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">My Restaurant Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  {review.user.name}
                </h2>

                <span className="text-yellow-500 font-medium">
                  ⭐ {review.rating}/5
                </span>
              </div>

              <p className="text-gray-700 mb-2">
                {review.comment}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}