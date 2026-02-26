"use client";

import { useState } from "react";
import Sidebar from "../../_components/SideBar";
import { Star, MessageCircle, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import UpdateRestaurantModal from "../../profile/_components/UpdateRestaurantModel";

interface DashboardProps {
  restaurant: any;
  menuCount: number;
  reviews: any[]; // Added this prop
}
export default function DashboardClient({
  restaurant,
  menuCount,
  reviews,
}: DashboardProps) {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const latestTwoReviews = Array.isArray(reviews) ? reviews.slice(0, 2) : [];

  const stats = {
    averageReviews: restaurant?.averageReviews || "0.0",
    reviews: restaurant?.totalReviews || 0,
    menuItems: restaurant?.menu?.length || 0,
    views: restaurant?.views || 0,
    name: restaurant?.name || "Chef",
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {stats.name}! 🍕
            </h1>
            <p className="text-gray-500">Your kitchen is looking busy today.</p>
          </div>
        </div>

        {/* Highlight Card */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Star size={18} />
              <span className="text-sm text-green-500">Live Rating</span>
            </div>
            <p className="text-gray-500 text-sm">AVERAGE RATING</p>
            <h2 className="text-2xl font-bold">{stats.averageReviews} ⭐</h2>
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
            <h2 className="text-2xl font-bold">{menuCount}</h2>
          </div>
        </div>

        {/* Latest Reviews (Mapped from data if available) */}
        {latestTwoReviews.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow max-w-xl">
            <h2 className="font-semibold text-lg mb-4">Latest Love 🧡</h2>
            <div className="space-y-4">
              {latestTwoReviews.map((review, index) => {
                const rating = Math.max(
                  0,
                  Math.min(5, Math.round(Number(review?.rating) || 0)),
                );
                const comment = review?.comment || "No comment provided.";
                const userName =
                  review?.users?.name || review?.customer?.name || "Anonymous";
                const createdAt = review?.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : "";

                return (
                  <div
                    key={review?._id || `${userName}-${index}`}
                    className="border-l-4 border-orange-400 pl-4 "
                  >
                    <div className="text-yellow-500 text-sm mb-2">
                      {"★".repeat(rating)} {createdAt}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">"{comment}"</p>
                    <p className="text-gray-400 text-xs">— {userName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <UpdateRestaurantModal
        restaurant={restaurant}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
