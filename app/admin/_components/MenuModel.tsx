"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  handleGetMenusByRestaurant,
  handleAdminDeleteMenu,
} from "@/lib/actions/menu-actions";
import DeleteModal from "@/app/_components/DeleteModel";

interface Menu {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export default function MenuModal({
  open,
  onClose,
  restaurantId,
}: {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return null;

    const normalized = imageUrl.replace(/\\/g, "/");
    if (normalized.startsWith("http://") || normalized.startsWith("https://"))
      return normalized;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${base}${path}`;
  };

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await handleGetMenusByRestaurant(restaurantId);
      if (res.success) setMenus(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && restaurantId) fetchMenus();
  }, [open, restaurantId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await handleAdminDeleteMenu(deleteTarget);
      if (res.success) {
        setMenus((prev) => prev.filter((m) => m._id !== deleteTarget));
        toast.success("Menu deleted");
      } else {
        toast.error(res.message || "Failed to delete menu");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
        <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-800">
                Restaurant <span className="text-[#E87A5D]">Menu</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Manage your restaurant menu
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Loading / No Menu */}
          {loading && (
            <p className="text-gray-500 text-center">Loading menu...</p>
          )}
          {!loading && menus.length === 0 && (
            <p className="text-gray-400 text-center py-20">
              No menu items available.
            </p>
          )}

          {/* Menu Grid */}
          {!loading && menus.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((item) => {
                const imageSrc = getImageSrc(item.imageUrl);
                return (
                  <div
                    key={item._id}
                    className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
                  >
                    {/* Delete Button */}
                    <button className="absolute top-4 right-3 text-red-500 hover:text-red-600 transition">
                      <Trash2 size={16} />
                    </button>

                    {/* Image */}
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover rounded-2xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-2xl mb-4">
                        No Image Available
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#E87A5D] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>
                      <span className="font-black text-[#E87A5D]">
                        Rs {item.price}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 text-sm mt-2">
                        {item.description}
                      </p>
                    )}

                    {!item.isAvailable && (
                      <span className="inline-block mt-3 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                        Not Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item?"
      />
    </>
  );
}
