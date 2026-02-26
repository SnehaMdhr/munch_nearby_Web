"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";

// inside Page()
import {
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleGetMyFavourites,
} from "@/lib/actions/favourite-actions";
import { MapIcon, MapPin, Search, Utensils, X } from "lucide-react";
import Link from "next/link";
import RestaurantMapSheet from "../map/_components/RestaurantMapSheet";
import Header from "../_components/Header";

export default function Page() {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mapOpen, setMapOpen] = useState(false);
  const [mapRestaurantId, setMapRestaurantId] = useState<string | null>(null);
  // ---------------- FETCH RESTAURANTS ----------------
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await handleGetAllRestaurants();

        if (res.success && Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else {
          setError(res.message || "Failed to fetch restaurants");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // ---------------- FETCH MY FAVOURITES ----------------
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user) return;

      try {
        const res = await handleGetMyFavourites();

        if (res.success && Array.isArray(res.data)) {
          const ids = res.data
            .map((fav: any) => fav?.restaurant?._id)
            .filter((id: string | undefined): id is string => Boolean(id));

          setFavourites(ids);
        } else {
          console.error(res.message || "Failed to fetch favourites");
        }
      } catch (err: any) {
        console.error(err?.message || "Failed to fetch favourites");
      }
    };

    fetchFavourites();
  }, [user]);

  // ---------------- TOGGLE FAVOURITE ----------------
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
    } catch (err) {
      console.error("Favourite toggle failed");
    } finally {
      setFavLoading(null);
    }
  };

  // ---------------- FILTER LOGIC ----------------
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name?.toLowerCase().includes(query) ||
      restaurant.category?.toLowerCase().includes(query) ||
      restaurant.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Header />

      <div className="p-6 ">
        <div className="bg-linear-to-br from-[#FFD8C4] to-[#E87A5D] rounded-[20px] px-8 py-8 mb-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1F2937] mb-1">
            Customer Dashboard
          </h1>

          <p className="text-md text-gray-600 mb-6">
            Welcome back,{" "}
            <span className="text-[#E87A5D] font-bold">{user?.name}</span>. What
            are you craving today?
          </p>

          {/* Search Row */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Restaurants Here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ---------------- RESTAURANTS SECTION ---------------- */}

        <div className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : "Explore Restaurants"}
          </h2>

          {loading && <p className="text-gray-500">Loading restaurants...</p>}

          {error && <p className="text-red-500 font-medium">{error}</p>}

          {!loading && filteredRestaurants.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 italic">
                No restaurants found matching your search.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#E87A5D] text-sm font-bold mt-2 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col group"
              >
                {/* Image Container with Absolute Favourite Icon */}
                <div className="relative w-full h-40 overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* Top Right Favourite Button */}
                  <button
                    onClick={() => handleToggleFavourite(restaurant._id)}
                    disabled={favLoading === restaurant._id}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur shadow-md rounded-full hover:scale-110 transition active:scale-95 disabled:opacity-50"
                  >
                    {favLoading === restaurant._id ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 animate-spin rounded-full" />
                    ) : favourites.includes(restaurant._id) ? (
                      <span className="text-xl leading-none">❤️</span>
                    ) : (
                      <span className="text-xl leading-none">🤍</span>
                    )}
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {restaurant.name}
                    </h3>
                    {restaurant.category && (
                      <span className=" py-0.5 text-sm text-[#D06D53] font-bold rounded tracking-tight w-fit bg-[#FFF8F4]">
                        {restaurant.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-0.5 mb-1">
                    <MapPin
                      size={15}
                      className="text-gray-400 shrink-0"
                      strokeWidth={2.5}
                    />
                    <p className="text-sm leading-tight text-gray-500 line-clamp-1">
                      {restaurant.address}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex w-full items-center gap-2">
                    {restaurant.mapLink && (
                      <a
                        onClick={() => {
                          setMapRestaurantId(restaurant._id);

                          setMapOpen(true);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                      >
                        <MapIcon size={14} strokeWidth={2.5} />
                        <span>Map</span>
                      </a>
                    )}
                    <Link
                      href={`/customer/dashboard/${restaurant._id}/menu`}
                      className="flex-1 flex items-center justify-center gap-2 
                               py-3 text-white text-xs font-semibold 
                               rounded-xl transition shadow-sm
                               bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                               hover:opacity-90"
                    >
                      <Utensils size={14} strokeWidth={2.5} />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RestaurantMapSheet
        open={mapOpen}
        onOpenChange={setMapOpen}
        restaurants={filteredRestaurants}
        restaurantId={mapRestaurantId}
      />
    </div>
  );
}
