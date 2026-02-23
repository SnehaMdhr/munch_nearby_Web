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
  import { MapIcon, MapPin, Search, Utensils } from "lucide-react";
import Link from "next/link";

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

        <div className="flex-1 p-6 ">
          <div className="bg-linear-to-br from-[#FFD8C4] to-[#E87A5D] rounded-[20px] px-8 py-8 mb-8">


          {/* Title */}
          <h1 className="text-2xl font-bold text-[#1F2937] mb-1">
            Customer Dashboard
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Welcome back,{" "}
            <span className="text-[#E87A5D] font-bold">
              {user?.name}
            </span>
            . What are you craving today?
          </p>

          {/* Search Row */}
        
            <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                placeholder="Search restaurants here ..."
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
                  />
                </div>
        </div>

          {/* ---------------- RESTAURANTS SECTION ---------------- */}

          <div className="p-6 mt-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col"
                >
                  {/* Image Container with Absolute Favourite Icon */}
                  <div className="relative w-full height-30 overflow-hidden">
                    {restaurant.imageUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {/* Top Right Favourite Button (No Text) */}
                    <button
                      onClick={() => handleToggleFavourite(restaurant._id)}
                      disabled={favLoading === restaurant._id}
                      className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur shadow-md rounded-full hover:scale-110 transition active:scale-95 disabled:opacity-50"
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
                    <h3 className="text-lg font-bold text-gray-800">
                      {restaurant.name}
                    </h3>

                    {restaurant.category && (
                      <span className="inline-block px-1.5 py-0.5 text-[10px] text-[#D06D53] font-bold rounded tracking-tight w-fit mb-1">
                        {restaurant.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 mt-0.5 mb-1">
                      {/* Smaller Icon with fixed width */}
                      <MapPin 
                        size={15} 
                        className="text-gray-400 shrink-0" 
                        strokeWidth={2.5} 
                      />

                      {/* Tiny text with line height control */}
                      <p className="text-[10px] leading-2.5 text-gray-500 line-clamp-1">
                        {restaurant.address}
                      </p>
                    </div>
                    <div className="mt-6 flex w-full items-center gap-2">
                      
                      {restaurant.mapLink && (
                        <a
                          href={restaurant.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                        >
                          <MapIcon size={14} strokeWidth={2.5} />
                          <span>Map</span>
                        </a>
                      )}
                      <Link
                        href={`/customer/dashboard/${restaurant._id}`}
                        style={{ backgroundColor: "#E87A5D" }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition shadow-sm"
                      >
                        <Utensils size={14} strokeWidth={2.5} />
                        <span>Menu</span>
                      </Link>
                        
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }