"use client";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="relative h-32 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] flex items-center px-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition"
          ></button>
          <div>
            <h2 className="text-3xl font-black text-white">
              {restaurant.name}
            </h2>
            <p className="text-orange-100 text-sm font-medium">
              Detailed Establishment Profile
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-10 overflow-y-auto custom-scrollbar">
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
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Email Address
                </h4>
                <p className="text-lg font-bold text-[#E87A5D] underline">
                  {restaurant.email || restaurant.owner?.email || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Contact Phone
                </h4>
                <p className="text-lg font-bold text-gray-800">
                  {restaurant.contactNumber || "Not Provided"}
                </p>
              </div>
              {restaurant.category && (
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Category
                  </h4>
                  <span className="px-3 py-1 bg-orange-50 text-[#E87A5D] text-xs font-bold rounded-lg border border-orange-100">
                    {restaurant.category}
                  </span>
                </div>
              )}
            </section>

            {/* Right Column */}
            <section className="space-y-6 border-l border-gray-100 pl-0 md:pl-10">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Registration Date
                </h4>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(restaurant.createdAt).toLocaleDateString(
                    undefined,
                    { dateStyle: "long" },
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Current Status
                </h4>
                <span
                  className={`mt-1 inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(restaurant.status.toLowerCase())}`}
                >
                  {restaurant.status}
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Location
                </h4>
                <p className="text-sm font-medium text-gray-600 italic leading-relaxed mb-2">
                  {restaurant.address || "Address not available."}
                </p>
                {restaurant.mapLink && (
                  <a
                    href={restaurant.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-500 hover:underline"
                  >
                    View on Google Maps ↗
                  </a>
                )}
              </div>
            </section>
          </div>

          {/* Description Box */}
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

          {/* Opening Hours Section */}
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

        {/* Footer */}
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
