"use client";

import { handleGetRestaurantById } from "@/lib/actions/restaurant-actions";
import Sidebar from "../../_components/SideBar";
import Tabs from "./_components/Tab";
import { useEffect, useState, use } from "react";
import { Star, StarHalf, MapPin } from "lucide-react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React's use() hook for Next.js 15
  const { id } = use(params);
  
  // Environment variables
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Static Data for Reviews
  const staticRating = 4.5;
  const staticReviewCount = 128;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await handleGetRestaurantById(id);
        if (!res.success || !res.data) {
          throw new Error("Restaurant not found");
        }
        setRestaurant(res.data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-medium">Loading Restaurant Details...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        
        {/* Restaurant Header */}
        <div className="bg-white p-8 flex flex-col md:flex-row items-start gap-8 ">
          
          {/* 1. Image Section */}
          {restaurant.imageUrl && (
            <div className="w-32 h-32 md:w-130 md:h-100 relative flex-shrink-0">
              <img
                src={`${API_BASE}${restaurant.imageUrl}`}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-100"
              />
            </div>
          )}

          {/* 2. Info Section */}
          <div className="flex-1 pt-8">
            {/* Category Badges */}
            

            {/* Title */}
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {restaurant.name}
            </h1>

            {/* 3. Star Ratings (Static) */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <StarHalf size={18} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-gray-800">{staticRating}</span>
              <span className="text-sm text-gray-400 font-medium">({staticReviewCount} reviews)</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {Array.isArray(restaurant.category) ? (
                restaurant.category.map((cat: string, index: number) => (
                  <span key={index} className="px-2.5 py-0.5 bg-blue-50 text-[#E87A5D] text-[11px] font-bold rounded-full uppercase tracking-wider">
                    {cat}
                  </span>
                ))
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
                {typeof restaurant.location === 'object' 
                  ? (restaurant.address || "Location detail available") 
                  : restaurant.location}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-3xl">
              {restaurant.description}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-0 z-10 bg-gray-50">
          <Tabs id={id} />
        </div>

        {/* Dynamic Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}