"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import {
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleGetMyFavourites,
} from "@/lib/actions/favourite-actions";
import { MapPin, Search, ArrowUpDown, Star } from "lucide-react";
import Header from "../_components/Header";

export default function Page() {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating">("name");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRest, resFav] = await Promise.all([
          handleGetAllRestaurants(),
          user
            ? handleGetMyFavourites()
            : Promise.resolve({ success: false, data: [] }),
        ]);

        if (resRest.success && Array.isArray(resRest.data)) {
          setRestaurants(resRest.data);
        }

        if (resFav.success && Array.isArray(resFav.data)) {
          const ids = resFav.data
            .map((fav: any) => fav?.restaurant?._id)
            .filter((id: string | undefined): id is string => Boolean(id));
          setFavourites(ids);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ---------------- TOGGLE FAVOURITE ---------------- */
  const handleToggleFavourite = async (restaurantId: string) => {
    if (!user) return;
    setFavLoading(restaurantId);
    try {
      if (favourites.includes(restaurantId)) {
        const res = await handleRemoveFromFavourite(restaurantId);
        if (res.success) {
          setFavourites((prev) => prev.filter((id) => id !== restaurantId));
        }
      } else {
        const res = await handleAddToFavourite(restaurantId);
        if (res.success) {
          setFavourites((prev) => [...prev, restaurantId]);
        }
      }
    } finally {
      setFavLoading(null);
    }
  };

  /* ---------------- FILTER & SORT LOGIC ---------------- */
  const processedRestaurants = useMemo(() => {
    // 1. Get only favourites
    let list = restaurants.filter((r) => favourites.includes(r._id));

    // 2. Apply Search
    if (searchQuery.trim()) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 3. Apply Sort
    return list.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0); // Higher rating first
      }
      return a.name.localeCompare(b.name); // Alphabetical
    });
  }, [restaurants, favourites, searchQuery, sortBy]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="p-4 max-w-7xl mx-auto">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-800">
            Your Favourite <span className="text-orange-500">Restaurants</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your saved culinary gems ❤️
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-10 mt-10 items-center justify-between">
          {/* Long & Slim Search Bar */}
          <div className="relative w-full max-w-5xl group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E87A5D] transition-transform duration-300 group-focus-within:scale-105"
              size={20}
            />
            <input
              type="text"
              placeholder="Search your Favourites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-10 py-3 rounded-2xl border-2 border-[#E87A5D]/10 
                 focus:outline-none focus:ring-4 focus:ring-[#E87A5D]/10 focus:border-[#E87A5D] 
                 transition-all bg-white shadow-sm hover:shadow-md hover:border-[#E87A5D]/30
                 text-base placeholder:text-gray-400 text-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E87A5D] transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <div className="relative w-full lg:w-56">
              <ArrowUpDown
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E87A5D]"
                size={16}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-[#E87A5D]/10 
                   rounded-2xl appearance-none focus:outline-none focus:ring-4 
                   focus:ring-[#E87A5D]/10 focus:border-[#E87A5D] transition-all 
                   text-sm font-bold text-gray-700 shadow-sm cursor-pointer"
              >
                <option value="name">Sort: A-Z</option>
                <option value="rating">Sort: Top Rated</option>
              </select>
              {/* Dropdown Chevron */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#E87A5D]"></div>
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#E87A5D] animate-spin rounded-full" />
          </div>
        )}

        {!loading && processedRestaurants.length === 0 && (
          <div className="relative overflow-hidden rounded-[3rem] border-2 border-[#E87A5D]/10 bg-white p-16 text-center shadow-xl shadow-[#E87A5D]/5">
            {/* Decorative background blobs for a modern feel */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#E87A5D]/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#F6B88F]/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container with subtle pulse */}
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF4ED] text-[#E87A5D]">
                {searchQuery ? (
                  <Search size={48} strokeWidth={1.5} />
                ) : (
                  <Star
                    size={48}
                    strokeWidth={1.5}
                    fill="currentColor"
                    className="opacity-80"
                  />
                )}
              </div>

              <h2 className="mb-3 text-3xl font-extrabold text-gray-800 tracking-tight">
                {searchQuery ? "No matches found" : "Your list is empty"}
              </h2>

              <p className="mx-auto max-w-md text-lg text-gray-500 leading-relaxed mb-8">
                {searchQuery
                  ? `We couldn't find anything matching "${searchQuery}". Try checking for typos or searching another cuisine.`
                  : "It looks like you haven't saved any culinary gems yet. Start exploring to build your dream list!"}
              </p>

              {/* Action Button */}
              <button
                onClick={() =>
                  searchQuery
                    ? setSearchQuery("")
                    : (window.location.href = "/customer/dashboard")
                }
                className="group flex items-center gap-2 rounded-full bg-[#E87A5D] px-8 py-3.5 font-bold text-white transition-all hover:bg-[#D06D53] hover:shadow-lg hover:shadow-[#E87A5D]/30 active:scale-95"
              >
                {searchQuery ? "Clear Search" : "Explore Restaurants"}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {processedRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Optional Rating Badge */}
                {restaurant.rating && (
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={14} fill="#E87A5D" className="text-[#E87A5D]" />
                    <span className="text-xs font-bold text-gray-800">
                      {restaurant.rating}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleToggleFavourite(restaurant._id)}
                  disabled={favLoading === restaurant._id}
                  className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-lg hover:scale-110 transition-all disabled:opacity-50"
                >
                  {favLoading === restaurant._id ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-[#E87A5D] animate-spin rounded-full" />
                  ) : (
                    <span className="text-[#E87A5D]">❤️</span>
                  )}
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {restaurant.name}
                </h3>
                <p className="py-0.5 text-sm text-[#D06D53] font-bold rounded tracking-tight w-fit bg-[#FFF8F4]">
                  {restaurant.category}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                  <MapPin size={14} />
                  <p className="text-xs line-clamp-1">{restaurant.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
