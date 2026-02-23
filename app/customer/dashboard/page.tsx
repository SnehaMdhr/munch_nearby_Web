"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/SideBar";
import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import {
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleGetMyFavourites,
} from "@/lib/actions/favourite-actions";

export default function Page() {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          setFavourites((prev) =>
            prev.filter((id) => id !== restaurantId)
          );
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Customer Dashboard</h1>

        {user ? (
          <p className="mt-2 text-gray-600">
            Welcome, {user.email}
          </p>
        ) : (
          <p className="mt-2 text-gray-400">
            Loading user...
          </p>
        )}

        {/* ---------------- RESTAURANTS SECTION ---------------- */}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Explore Restaurants
          </h2>

          {loading && <p>Loading restaurants...</p>}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && restaurants.length === 0 && (
            <p>No restaurants available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                {restaurant.imageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {restaurant.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {restaurant.address}
                  </p>

                  {restaurant.category && (
                    <p className="text-sm text-gray-500 mt-1">
                      {restaurant.category}
                    </p>
                  )}

                  {restaurant.description && (
                    <p className="text-sm mt-2 line-clamp-2">
                      {restaurant.description}
                    </p>
                  )}

                  {restaurant.mapLink && (
                    <a
                      href={restaurant.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm mt-2 inline-block"
                    >
                      View on Map
                    </a>
                  )}

                  {/* -------- BUTTONS -------- */}
                  <div className="mt-4 flex gap-2 items-center">
                    <a
                      href={`/customer/dashboard/${restaurant._id}/menu`}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
                    >
                      Menu
                    </a>

                    <button
                      onClick={() =>
                        handleToggleFavourite(restaurant._id)
                      }
                      disabled={favLoading === restaurant._id}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        favourites.includes(restaurant._id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {favLoading === restaurant._id
                        ? "Loading..."
                        : favourites.includes(restaurant._id)
                        ? "❤️ Remove"
                        : "🤍 Favourite"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------ */}
      </div>
    </div>
  );
}
