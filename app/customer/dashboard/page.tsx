"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import {
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleGetMyFavourites,
} from "@/lib/actions/favourite-actions";
import {
  MapIcon,
  MapPin,
  Search,
  Utensils,
  X,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import RestaurantMapSheet from "../../_components/RestaurantMapSheet";
import Header from "../_components/Header";

type DashboardPageContentProps = {
  hideHeader?: boolean;
};

export default function Page() {
  return <DashboardPageContent />;
}

export function DashboardPageContent({
  hideHeader = false,
}: DashboardPageContentProps) {
  const { user } = useAuth();
  const isCustomer =
    String(user?.role ?? "")
      .trim()
      .toLowerCase() === "customer";

  const requireLogin = () => {
    if (!user) {
      toast.info("Please login first");
      return false;
    }
    return true;
  };

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyOpenNow, setOnlyOpenNow] = useState(false); // New State

  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mapOpen, setMapOpen] = useState(false);
  const [mapRestaurantId, setMapRestaurantId] = useState<string | null>(null);

  // Real-time clock: updates every 60s so open/closed status stays current
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

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
      if (!user || !isCustomer) {
        setFavourites([]);
        return;
      }
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
  }, [user, isCustomer]);

  // ---------------- TOGGLE FAVOURITE ----------------
  const handleToggleFavourite = async (restaurantId: string) => {
    if (!requireLogin()) return;
    if (!isCustomer) {
      toast.info("Customers only");
      return;
    }
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

  // ---------------- UPDATED FILTER LOGIC ----------------
  const categories = [
    "All",
    ...new Set(restaurants.map((res) => res.category).filter(Boolean)),
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = searchQuery.toLowerCase();

    // 1. Search Logic
    const matchesSearch =
      restaurant.name?.toLowerCase().includes(query) ||
      restaurant.category?.toLowerCase().includes(query) ||
      restaurant.address?.toLowerCase().includes(query);

    // 2. Category Logic
    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;

    // 3. Open Now Logic
    const status = getRestaurantStatus(
      restaurant.openingHours || [],
      new Date(currentTime),
    );
    const matchesOpenNow = !onlyOpenNow || status === "Open";

    return matchesSearch && matchesCategory && matchesOpenNow;
  });

  return (
    <div className="min-h-screen">
      {!hideHeader && <Header />}

      {/* HERO SECTION */}
      <div className="px-6 pt-6">
        <div className="bg-orange-100 border-2 border-dashed border-orange-300  rounded-4xl px-8 py-16 flex flex-col items-center justify-center text-center shadow-lg">
          {/*bg-linear-to-r from-[#FF9860] to-[#E87A5D]*/}
          <h1 className="text-5xl font-extrabold text-black mb-3 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-black/90 text-lg mb-8">
            Welcome back,{" "}
            <span className="underline decoration-2 w-full py-3 text-[#E87A5D] underline-offset-4 font-bold">
              {user?.name || "John Doe"}
            </span>
            . What are you craving today?
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-2 flex items-center shadow-xl">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Restaurants, Cuisines, or Dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button className="px-8 py-2.5 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-200">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* RESTAURANTS LISTING */}
      <div className="p-8 max-w-350 mx-auto">
        {/* Filter Section */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {/* Open Now Filter */}
          <button
            onClick={() => setOnlyOpenNow(!onlyOpenNow)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              onlyOpenNow
                ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-500"
            }`}
          >
            <Clock size={16} />
            {onlyOpenNow ? "Showing Open" : "Open Now"}
          </button>

          <div className="h-6 w-px bg-gray-200 mx-2 shrink-0" />

          {/* Category Filters */}
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-[#E87A5D] text-white border-[#E87A5D] shadow-md shadow-orange-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#E87A5D] hover:text-[#E87A5D]"
              }`}
            >
              {cat as string}
            </button>
          ))}

          {/* <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm ml-auto">
            <SlidersHorizontal size={16} className="text-[#E87A5D]" />
            <span>More Filters</span>
          </button> */}
        </div>

        <div className="flex items-center justify-between mb-8 mt-4">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Explore Restaurants"}
            </h2>
            <p className="text-gray-500">
              {filteredRestaurants.length} places match your current filters
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-20">
            Loading restaurants...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-medium py-20">{error}</p>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <p className="text-gray-500 italic">
              No restaurants found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setOnlyOpenNow(false);
              }}
              className="text-[#E87A5D] text-sm font-bold mt-2 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => {
            const status = getRestaurantStatus(
              restaurant.openingHours || [],
              new Date(currentTime),
            );
            const isOpen = status === "Open";

            return (
              <div
                key={restaurant._id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${restaurant.imageUrl}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <Utensils size={32} />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}

                  <div
                    className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      isOpen
                        ? "bg-[#22C55E] text-white"
                        : status === "Closed"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                    }`}
                  >
                    {isOpen ? "Open Now" : status}
                  </div>

                  <button
                    onClick={() => handleToggleFavourite(restaurant._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                  >
                    <span className="text-xl">
                      {favourites.includes(restaurant._id) ? "❤️" : "🤍"}
                    </span>
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#E87A5D] transition-colors line-clamp-1">
                      {restaurant.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87A5D] bg-[#FFF1EB] px-2 py-0.5 rounded">
                      {restaurant.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 mb-6">
                    <MapPin size={14} className="shrink-0" />
                    <span className="text-sm line-clamp-1">
                      {restaurant.address}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (!requireLogin()) return;
                        setMapRestaurantId(restaurant._id);
                        setMapOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition"
                    >
                      <MapIcon size={16} />
                      Map
                    </button>
                    <Link
                      href={`/customer/dashboard/${restaurant._id}/menu`}
                      className="flex-1 flex py-3 items-center justify-center gap-2 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-orange-200"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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

type OpeningHour = {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
};
function getRestaurantStatus(openingHours: OpeningHour[], now: Date) {
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const today = openingHours.find((d) => d.day === dayName);

  if (!today || today.isClosed || !today.open || !today.close) return "Closed";

  const getCurrentMinutes = () => now.getHours() * 60 + now.getMinutes();
  const getTimeMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const currentMins = getCurrentMinutes();
  const openMins = getTimeMinutes(today.open);
  let closeMins = getTimeMinutes(today.close);

  if (closeMins <= openMins) {
    closeMins += 24 * 60;
  }

  if (currentMins >= openMins && currentMins < closeMins) {
    return "Open";
  }
  if (currentMins < openMins) {
    const diff = openMins - currentMins;
    if (diff < 240) {
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return h >= 1 ? `Opens in ${h}h` : `Opens in ${m}m`;
    }
  }

  return "Closed";
}
