"use client";

import { useEffect, useState } from "react";
import Sidebar from "../_components/SideBar";
import { getMyFavourites } from "@/lib/api/favourite";

export default function Page() {
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await getMyFavourites();

        if (res.success) {
          setFavourites(res.data);
        } else {
          setError(res.message || "Failed to fetch favourites");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          My Favourites
        </h1>

        {loading && <p>Loading favourites...</p>}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && favourites.length === 0 && (
          <p>No favourites added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favourites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              {fav.restaurant?.imageUrl && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE}${fav.restaurant.imageUrl}`}
                  alt={fav.restaurant?.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {fav.restaurant?.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {fav.restaurant?.address}
                </p>

                {fav.restaurant?.category && (
                  <p className="text-sm text-gray-500 mt-1">
                    {fav.restaurant.category}
                  </p>
                )}

                <a
                  href={`/customer/dashboard/${fav.restaurant?._id}/menu`}
                  className="mt-3 inline-block px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
                >
                  View Menu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
