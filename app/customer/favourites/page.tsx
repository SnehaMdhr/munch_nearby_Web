"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import {
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleGetMyFavourites,
} from "@/lib/actions/favourite-actions";
import { MapPin } from "lucide-react";
import Header from "../_components/Header";

export default function Page() {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH RESTAURANTS ---------------- */
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

  /* ---------------- FETCH FAVOURITES ---------------- */
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
        }
      } catch (err) {
        console.error("Failed to fetch favourites");
      }
    };

    fetchFavourites();
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

  /* ---------------- FILTER ONLY FAVOURITES ---------------- */
  const favouriteRestaurants = restaurants.filter((restaurant) =>
    favourites.includes(restaurant._id),
  );

  return (
    <div>
      <Header />

      <div className="p-6">
        <div
          className="bg-linear-to-r from-[#E87A5D]/10 to-[#F6B88F]/20 
                        rounded-3xl px-10 py-10 mb-12 
                        border border-[#E87A5D]/20"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Your Favourite Restaurants
          </h1>
          <p className="text-gray-600">Explore your current favourites</p>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500">Loading favourites...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Empty State */}
        {!loading && favouriteRestaurants.length === 0 && (
          <div className="rounded-3xl p-10 text-center shadow-sm border border-[#E87A5D]/20">
            <p className="text-gray-500 text-lg">
              You haven't added any favourites yet ❤️
            </p>
          </div>
        )}

        {/* Favourite Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {favouriteRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-3xl overflow-hidden 
                         border border-[#E87A5D]/10 
                         shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE */}
              <div className="relative">
                {restaurant.imageUrl ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                    alt={restaurant.name}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* ❤️ Toggle */}
                <button
                  onClick={() => handleToggleFavourite(restaurant._id)}
                  disabled={favLoading === restaurant._id}
                  className="absolute top-4 right-4 
                             bg-white/80 backdrop-blur 
                             p-2 rounded-full shadow-md 
                             hover:scale-110 transition 
                             disabled:opacity-50"
                >
                  {favLoading === restaurant._id ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-[#E87A5D] animate-spin rounded-full" />
                  ) : (
                    <span className="text-xl text-[#E87A5D]">❤️</span>
                  )}
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                  {restaurant.name}
                </h3>

                {restaurant.category && (
                  <span className="inline-block px-1.5 py-0.5 text-md text-[#D06D53] font-bold rounded tracking-tight w-fit mb-1 bg-[#FFF8F4]">
                    {restaurant.category}
                  </span>
                )}

                <div className="flex items-center gap-1 mt-0.5 mb-1">
                  <MapPin
                    size={15}
                    className="text-gray-400 shrink-0"
                    strokeWidth={2.5}
                  />
                  <p className="text-md leading-tight text-gray-500 line-clamp-1">
                    {restaurant.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
