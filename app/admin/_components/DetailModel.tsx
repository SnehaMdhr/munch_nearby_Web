"use client";

import RestaurantMapSheet from "@/app/customer/map/_components/RestaurantMapSheet";
import {
  ActivityIcon,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import MenuModel from "./MenuModel";
import ReviewModal from "./ReviewModel";

interface OpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface Restaurant {
  _id?: string;
  name: string;
  address: string;
  contactNumber: string;
  ownerName?: string;
  email?: string;
  owner?: {
    name?: string;
    email?: string;
  } | null;
  category?: string;
  description?: string;
  imageUrl?: string;
  mapLink?: string;
  status: string;
  averageReviews?: number;
  totalReviews?: number;
  openingHours?: OpeningHour[];
  createdAt: string;
}

export default function DetailModal({
  restaurant,
  onClose,
  getStatusStyle,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  getStatusStyle: (status: string) => string;
}) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-32 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] flex items-center px-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition"
          >
            <X size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white">
              {restaurant.name}
            </h2>
            <p className="text-orange-100 text-sm font-medium">
              Detailed Establishment Profile
            </p>
          </div>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {restaurant.imageUrl && (
            <div className="mb-10 w-full h-72 rounded-4xl overflow-hidden border border-gray-100 shadow-md">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display =
                    "none";
                }}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <section className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Owner Name
                </h4>
                <p className="text-lg font-bold text-gray-800">
                  {restaurant.ownerName || restaurant.owner?.name || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <Mail
                      size={14}
                      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </div>
                  <span className="relative">
                    Email
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                  </span>
                </h4>
                <p className="text-lg font-bold text-[#E87A5D] underline">
                  {restaurant.email || restaurant.owner?.email || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <Phone
                      size={14}
                      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </div>
                  <span className="relative">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                  </span>
                </h4>
                <p className="text-lg font-bold text-gray-800">
                  {restaurant.contactNumber || "Not Provided"}
                </p>
              </div>
              {restaurant.category && (
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                      <UtensilsCrossed
                        size={14}
                        className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                      />
                    </div>
                    <span className="relative">
                      Category
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                    </span>
                  </h4>
                  <span className="px-3 py-1 bg-orange-50 text-[#E87A5D] text-xs font-bold rounded-lg border border-orange-100">
                    {restaurant.category}
                  </span>
                </div>
              )}
            </section>

            <section className="space-y-6 border-l border-gray-100 pl-0 md:pl-10">
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <Calendar
                      size={14}
                      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </div>
                  <span className="relative">
                    Registeration Date
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                  </span>
                </h4>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(restaurant.createdAt).toLocaleDateString(
                    undefined,
                    { dateStyle: "long" },
                  )}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <ActivityIcon
                      size={14}
                      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </div>
                  <span className="relative">
                    Current Status
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                  </span>
                </h4>
                <span
                  className={`mt-1 inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(restaurant.status.toLowerCase())}`}
                >
                  {restaurant.status}
                </span>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-[#E87A5D]">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <MapPin
                      size={14}
                      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </div>
                  <span className="relative">
                    Location
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E87A5D]/30 transition-all duration-500 group-hover:w-full" />
                  </span>
                </h4>
                <p className="text-sm font-medium text-gray-600 italic leading-relaxed mb-2">
                  {restaurant.address || "Address not available."}
                </p>
                <button
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition"
                >
                  <MapPin size={14} />
                  View Map
                </button>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#E87A5D] text-xs font-bold rounded-xl border border-orange-100 hover:bg-orange-100 transition mt-3"
                >
                  <Utensils size={14} />
                  View Menu
                </button>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-xl border border-purple-100 hover:bg-purple-100 transition mt-3"
                >
                  View Reviews
                </button>
              </div>
            </section>
          </div>

          {restaurant.description && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Description
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-2xl">
                {restaurant.description}
              </p>
            </div>
          )}

          {restaurant.openingHours && restaurant.openingHours.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Opening Hours
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {restaurant.openingHours.map((hour, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {hour.day}
                    </p>
                    <p className="text-xs font-black text-gray-700">
                      {hour.isClosed
                        ? "Closed"
                        : `${hour.open} - ${hour.close}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
      <RestaurantMapSheet
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        restaurantId={restaurant._id || null}
        restaurants={restaurant._id ? [restaurant as any] : []}
      />
      <MenuModel
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        restaurantId={restaurant._id || ""}
      />

      <ReviewModal
        open={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        restaurantId={restaurant._id || ""}
      />
    </div>
  );
}
