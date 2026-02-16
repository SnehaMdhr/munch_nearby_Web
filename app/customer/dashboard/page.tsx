"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/SideBar";
import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";

export default function Page() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await handleGetAllRestaurants();

      if (res.success) {
        setRestaurants(res.data);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold">HomePage</h1>

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
                className="bg-white shadow-md rounded-xl overflow-hidden"
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
                    <p className="text-sm mt-2">
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
                  <a
    href={`/customer/dashboard/${restaurant._id}/menu`}
    className="px-3 py-1 bg-green-500 text-white text-sm rounded-md"
  >
    Menu
  </a>
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
