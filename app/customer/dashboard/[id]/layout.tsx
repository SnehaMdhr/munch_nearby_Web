"use client";

import { handleGetRestaurantById } from "@/lib/actions/restaurant-actions";
import { handleGetReviewsByRestaurant } from "@/lib/actions/review-actions";
import Sidebar from "../../_components/SideBar";
import Tabs from "./_components/Tab";
import { useEffect, useState } from "react";
import { Star, StarHalf, MapPin } from "lucide-react";
import { useParams } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

  const [restaurant, setRestaurant] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        /* ---------------- FETCH RESTAURANT ---------------- */
        const restaurantRes = await handleGetRestaurantById(id);

        if (!restaurantRes.success || !restaurantRes.data) {
          throw new Error("Restaurant not found");
        }

        setRestaurant(restaurantRes.data);

        /* ---------------- FETCH REVIEWS ---------------- */
        const reviewRes = await handleGetReviewsByRestaurant(id);

        if (reviewRes.success && Array.isArray(reviewRes.data)) {
          const reviews = reviewRes.data;
          const total = reviews.length;

          setReviewCount(total);

          if (total > 0) {
            const avg =
              reviews.reduce(
                (acc: number, r: any) =>
                  acc + Number(r.rating ?? 0),
                0
              ) / total;

            setRating(Number(avg.toFixed(1)));
          } else {
            setRating(0);
          }
        } else {
          setRating(0);
          setReviewCount(0);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ---------------- LOADING STATE ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-medium">
          Loading Restaurant Details...
        </div>
      </div>
    );
  }

  /* ---------------- ERROR STATE ---------------- */

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium">
          Restaurant not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* ---------------- HEADER ---------------- */}
        <div className="bg-white p-8 flex flex-col md:flex-row items-start gap-8">
          {/* Image */}
          {restaurant.imageUrl && (
            <div className="w-32 h-32 md:w-130 md:h-100 relative shrink-0">
              <img
                src={`${API_BASE}${restaurant.imageUrl}`}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-100"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {restaurant.name}
            </h1>

            {/* ---------------- DYNAMIC STAR RATING ---------------- */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => {
                  if (rating >= star) {
                    return (
                      <Star
                        key={star}
                        size={18}
                        fill="currentColor"
                      />
                    );
                  } else if (rating >= star - 0.5) {
                    return (
                      <StarHalf
                        key={star}
                        size={18}
                        fill="currentColor"
                      />
                    );
                  } else {
                    return <Star key={star} size={18} />;
                  }
                })}
              </div>

              <span className="text-sm font-bold text-gray-800">
                {rating.toFixed(1)}
              </span>

              <span className="text-sm text-gray-400 font-medium">
                ({reviewCount} review
                {reviewCount !== 1 && "s"})
              </span>
            </div>

            {/* Category */}
            <div className="flex flex-wrap gap-2 mb-3 mt-3">
              {Array.isArray(restaurant.category) ? (
                restaurant.category.map(
                  (cat: string, index: number) => (
                    <span
                      key={index}
                      className="px-2.5 py-0.5 bg-blue-50 text-[#E87A5D] text-[11px] font-bold rounded-full uppercase tracking-wider"
                    >
                      {cat}
                    </span>
                  )
                )
              ) : (
                <span className="inline-block px-1.5 mt-2 py-0.5 text-[15px] text-[#D06D53] font-bold rounded-lg tracking-tight w-fit mb-1 bg-[#FFF8F4]">
                  {restaurant.category}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 mt-3">
              <MapPin size={16} />
              <p className="text-sm font-medium">
                {restaurant.address || "Location detail available"}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-3xl">
              {restaurant.description}
            </p>
          </div>
        </div>

        {/* ---------------- TABS ---------------- */}
        <div className="sticky top-0 z-10 bg-gray-50">
          <Tabs id={id} />
        </div>

        {/* ---------------- CHILD CONTENT ---------------- */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}