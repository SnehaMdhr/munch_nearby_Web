import DashboardClient from "./_components/DashboardClient";
import { redirect } from "next/navigation";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";
import { handleGetReviewsForOwner } from "@/lib/actions/review-actions";

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

    const menuCount = restaurant.menus?.length || restaurant.menu?.length || 0;

    let reviews: {
      _id?: string;
      rating?: number;
      comment?: string;
      createdAt?: string;
      customer?: { _id?: string; name?: string };
    }[] = [];
    try {
      const reviewsRes = await handleGetReviewsForOwner();
      if (reviewsRes.success && Array.isArray(reviewsRes.data)) {
        reviews = reviewsRes.data.map((r: any) => {
          const actor = r.user ?? r.customer;
          const name =
            typeof actor === "string"
              ? undefined
              : actor?.name?.trim() || undefined;
          return {
            _id: r._id,
            rating:
              typeof r.rating === "number" ? r.rating : Number(r.rating) || 0,
            comment: r.comment ?? "",
            createdAt: r.createdAt ? String(r.createdAt) : undefined,
            customer: {
              _id: typeof actor === "string" ? actor : actor?._id,
              name,
            },
          };
        });
      }
    } catch {}

    if (!restaurant) {
      console.error("[Dashboard] No restaurant data");
      redirect("/restaurantowner/profile");
    }

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
