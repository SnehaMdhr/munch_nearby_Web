"use client";

import { useEffect, useState, useTransition } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import Link from "next/link";
import { Search, Eye, Trash2, Utensils } from "lucide-react";
import DeleteModal from "@/app/_components/DeleteModel";
import {
  handleApproveRestaurant,
  handleDeleteRestaurantByAdmin,
  handleGetAdminRestaurants,
  handleGetAllRestaurants,
  handleRejectRestaurant,
  handleSuspendRestaurant,
} from "@/lib/actions/restaurant-actions";
import DetailModal from "../_components/DetailModel";

interface Restaurant {
  id?: string;
  _id?: string;
  name: string;
  ownerName?: string;
  email?: string;
  owner?: {
    name?: string;
    email?: string;
  } | null;
  status: string;
  createdAt: string;
  contactNumber: string;
  address: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  mapLink?: string;
  openingHours?: any[];
}

const STATUS_OPTIONS = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

const normalizeStatus = (status?: string) =>
  (status || "pending").toString().trim().toLowerCase();

export default function ApprovalPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    const adminRes = await handleGetAdminRestaurants();
    const res = adminRes.success ? adminRes : await handleGetAllRestaurants();

    if (res.success) {
      // Debug: log the data to check for imageUrl
      console.log("Fetched restaurants:", res.data);
      const normalized = Array.isArray(res.data)
        ? res.data.map((item: Restaurant) => ({
            ...item,
            ownerName: item.ownerName || item.owner?.name || "N/A",
            email: item.email || item.owner?.email || "N/A",
          }))
        : [];
      setRestaurants(normalized);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onStatusChange = async (id: string, newStatus: string) => {
    startTransition(async () => {
      let result;
      const upperStatus = newStatus.toUpperCase();

      if (upperStatus === "APPROVED")
        result = await handleApproveRestaurant(id);
      else if (upperStatus === "REJECTED")
        result = await handleRejectRestaurant(id);
      else if (upperStatus === "SUSPENDED")
        result = await handleSuspendRestaurant(id);

      if (result?.success) loadData();
      else alert(result?.message || "Update failed");
    });
  };

  const onDelete = async () => {
    if (!deleteId) return;

    const res = await handleDeleteRestaurantByAdmin(deleteId);
    if (res.success) loadData();
    else alert(res.message);

    setDeleteId(null);
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesFilter =
      filter === "all" ? true : normalizeStatus(r.status) === filter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    const styles = {
      approved: "bg-green-50 text-green-600 border border-green-100",
      pending: "bg-amber-50 text-amber-600 border border-amber-100",
      rejected: "bg-red-50 text-red-600 border border-red-100",
      suspended: "bg-gray-50 text-gray-600 border border-gray-100",
    };
    return styles[status as keyof typeof styles] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Restaurant"
        description="Are you sure you want to delete this restaurant? This action is permanent."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl shadow-sm border border-gray-100 bg-white">
          <div className="relative flex w-full flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants by name or email..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#E87A5D]/20 focus:border-[#E87A5D] transition-all"
            />
          </div>

          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === s
                    ? "bg-white text-[#E87A5D] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Restaurant Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-20 text-gray-400 italic"
                    >
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E87A5D] border-t-transparent mb-4" />
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Loading Establishments...
                      </p>
                    </td>
                  </tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-20 text-gray-400 italic"
                    >
                      No restaurants found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((rest) => {
                    const currentStatus = normalizeStatus(rest.status);
                    return (
                      <tr
                        key={rest.id || rest._id}
                        className="group hover:bg-[#FFF8F4]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full border-2 border-orange-100 overflow-hidden bg-orange-50 shrink-0 relative">
                              {rest.imageUrl ? (
                                <img
                                  src={
                                    rest.imageUrl.startsWith("http")
                                      ? rest.imageUrl
                                      : `${API_BASE}${rest.imageUrl}`
                                  }
                                  alt={rest.name}
                                  className="h-12 w-12 object-cover rounded-full border border-orange-100 bg-orange-50"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-[#E87A5D] border border-orange-100">
                                  <Utensils className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-black text-gray-800 text-lg group-hover:text-[#E87A5D] transition-colors line-clamp-1">
                                {rest.name}
                              </div>
                              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                                {rest.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(currentStatus)}`}
                          >
                            {rest.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-bold">
                          {new Date(rest.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-3">
                            <button
                              onClick={() => setSelectedRestaurant(rest)}
                              className="p-2.5 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <select
                              value={currentStatus}
                              onChange={(e) =>
                                onStatusChange(
                                  (rest.id || rest._id)!,
                                  e.target.value,
                                )
                              }
                              className="text-[10px] font-black uppercase tracking-widest rounded-xl border-gray-100 px-3 py-2.5 bg-gray-50 hover:bg-white hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approve</option>
                              <option value="rejected">Reject</option>
                              <option value="suspended">Suspend</option>
                            </select>

                            <button
                              onClick={() =>
                                setDeleteId((rest.id || rest._id)!)
                              }
                              className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedRestaurant && (
        <DetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          getStatusStyle={getStatusStyle}
        />
      )}
    </div>
  );
}
