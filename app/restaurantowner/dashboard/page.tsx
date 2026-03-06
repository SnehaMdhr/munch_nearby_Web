import DashboardClient from "./_components/DashboardClient";
import { redirect } from "next/navigation";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";
import { handleGetReviewsForOwner } from "@/lib/actions/review-actions";
import { handleGetMenusByRestaurant } from "@/lib/actions/menu-actions";

function StatusMessage({ status }: { status?: string | null }) {
  let message = "Please create your restaurant first.";
  let color = "bg-yellow-50 text-yellow-700 border-yellow-200";

  switch (status) {
    case "PENDING":
      message =
        "Your restaurant is under review. Please wait for admin approval.";
      break;
    case "REJECTED":
      message = "Your restaurant was rejected. Please contact support.";
      color = "bg-red-50 text-red-700 border-red-200";
      break;
    case "SUSPENDED":
      message = "Your restaurant has been suspended by admin.";
      color = "bg-red-50 text-red-700 border-red-200";
      break;
    case "APPROVED":
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className={`p-8 rounded-2xl border max-w-md ${color}`}>
        <h2 className="text-xl font-bold mb-4">Restaurant Status</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default async function Page() {
  try {
    const response = await handleGetMyRestaurant();

    if (!response.success || !response.data) {
      return <StatusMessage />;
    }

    const restaurant = response.data;

    if (restaurant.status !== "APPROVED") {
      return <StatusMessage status={restaurant.status} />;
    }

    // Use menus endpoint for accurate count
    let menuCount = restaurant.menus?.length || restaurant.menu?.length || 0;
    try {
      const menusRes = await handleGetMenusByRestaurant(restaurant._id);
      if (menusRes.success && Array.isArray(menusRes.data)) {
        menuCount = menusRes.data.length;
      }
    } catch {}

    const toValidRating = (value: unknown): number | undefined => {
      const n =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? parseFloat(value)
            : NaN;

      if (!Number.isFinite(n)) return undefined;
      if (n < 1 || n > 5) return undefined;
      return n;
    };

    let reviews: {
      _id?: string;
      rating?: number;
      comment?: string;
      createdAt?: string;
      customer?: { _id?: string; name?: string };
    }[] = [];

    type RawReview = {
      _id?: string;
      rating?: number | string | null;
      comment?: string | null;
      createdAt?: string | Date | null;
      user?: string | { _id?: string; name?: string | null } | null;
      customer?: string | { _id?: string; name?: string | null } | null;
      restaurant?: string | { _id?: string } | null;
    };

    const isForCurrentRestaurant = (r: RawReview, restaurantId: string) => {
      const rid =
        typeof r.restaurant === "string" ? r.restaurant : r.restaurant?._id;
      return !rid || String(rid) === String(restaurantId);
    };

    try {
      const reviewsRes = await handleGetReviewsForOwner();

      const raw: RawReview[] = Array.isArray(reviewsRes?.data)
        ? (reviewsRes.data as RawReview[])
        : Array.isArray(reviewsRes?.data?.reviews)
          ? (reviewsRes.data.reviews as RawReview[])
          : [];

      const seen = new Set<string>();

      reviews = raw
        .filter((r) => isForCurrentRestaurant(r, restaurant._id))
        .map((r: RawReview) => {
          const actor = r.user ?? r.customer;
          const id = r?._id ? String(r._id) : undefined;

          const rating = toValidRating(r?.rating);

          return {
            _id: id,
            rating,
            comment: typeof r?.comment === "string" ? r.comment : "",
            createdAt: r?.createdAt ? String(r.createdAt) : undefined,
            customer: {
              _id: typeof actor === "string" ? actor : actor?._id,
              name: typeof actor === "string" ? undefined : actor?.name?.trim(),
            },
          };
        })
        .filter((r: { _id?: string; rating?: number }) => {
          if (!r._id || seen.has(r._id)) return false;
          seen.add(r._id);
          return typeof r.rating === "number";
        });
    } catch {}

    return (
      <DashboardClient
        restaurant={restaurant}
        menuCount={menuCount}
        reviews={reviews}
      />
    );
  } catch (error) {
    console.error("[Dashboard] Exception:", error);
    redirect("/restaurantowner/profile");
  }
}
