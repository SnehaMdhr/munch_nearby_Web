"use client";

import { useState, useMemo } from "react";
import { Star, MessageCircle, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import UpdateRestaurantModal from "./UpdateRestaurantModel";
import Header from "../../_components/Header";

interface Review {
  _id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  customer?: {
    _id?: string;
    name?: string;
  };
}

interface Restaurant {
  averageReviews?: number;
  totalReviews?: number;
  menu?: any[];
}

interface DashboardProps {
  restaurant: Restaurant;
  menuCount: number;
  reviews: Review[];
}

export default function DashboardClient({
  restaurant,
  menuCount,
  reviews,
}: DashboardProps) {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const latestTwoReviews = useMemo(
    () => (Array.isArray(reviews) ? reviews.slice(0, 2) : []),
    [reviews],
  );

  const stats = {
    averageReviews: restaurant?.averageReviews ?? 0,
    reviews: restaurant?.totalReviews ?? 0,
    menuItems: menuCount ?? 0,
  };

  return (
    <div>
      <Header />

      <div className="p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back! 🍕</h1>
            <p className="text-gray-500">Your kitchen is looking busy today.</p>
          </div>
        </div>

        <div className="bg-orange-100 border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Keep your flavor fresh!
          </h2>
          <p className="text-gray-600 mb-6">
            Update your menu, photos, and operating hours to keep your customers
            hungry for more.
          </p>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow transition-colors"
          >
            Update Restaurant Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Star size={18} />
              <span className="text-sm text-green-500">Live Rating</span>
            </div>
            <p className="text-gray-500 text-sm">AVERAGE RATING</p>
            <h2 className="text-2xl font-bold">
              {stats.averageReviews.toFixed(1)} ⭐
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <MessageCircle size={18} />
              <span className="text-sm text-blue-400">Total</span>
            </div>
            <p className="text-gray-500 text-sm">REVIEWS</p>
            <h2 className="text-2xl font-bold">{stats.reviews}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Utensils size={18} />
              <span className="text-sm text-green-400">Active</span>
            </div>
            <p className="text-gray-500 text-sm">MENU ITEMS</p>
            <h2 className="text-2xl font-bold">{stats.menuItems}</h2>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-2xl shadow w-full">
          <h2 className="font-semibold text-lg mb-4">Latest Love 🧡</h2>

          {latestTwoReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestTwoReviews.map((review, index) => {
                const rating = Math.max(
                  0,
                  Math.min(5, Math.round(review?.rating ?? 0)),
                );

                const userName = review?.customer?.name || "Anonymous";

                return (
                  <div
                    key={review?._id ?? index}
                    className="border-l-4 border-orange-400 pl-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-yellow-500 text-sm">
                          {"★".repeat(rating)}
                          {"☆".repeat(5 - rating)}
                        </div>
                        <span className="text-gray-400 text-xs">
                          {review?.createdAt &&
                            new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 italic leading-relaxed">
                        "{review?.comment}"
                      </p>
                    </div>

                    <p className="text-gray-500 font-medium text-xs mt-auto">
                      — {userName}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>

      <UpdateRestaurantModal
        restaurant={restaurant}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
