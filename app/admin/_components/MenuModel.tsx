"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* -------------------- IMAGE HANDLER -------------------- */

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return null;

    const normalizedPath = imageUrl.replace(/\\/g, "/");

    if (
      normalizedPath.startsWith("http://") ||
      normalizedPath.startsWith("https://")
    ) {
      return normalizedPath;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
    if (!apiBase) return normalizedPath;

    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const path = normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;

    return `${base}${path}`;
  };

  /* -------------------- FETCH MENUS -------------------- */

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await handleGetMenusByRestaurant(restaurantId);
      if (res.success) {
        setMenus(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !restaurantId) return;
    fetchMenus();
  }, [open, restaurantId]);

  /* -------------------- DELETE MENU -------------------- */

  const handleDelete = (menuId: string) => {
    setDeleteTarget(menuId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget);

    try {
      const res = await handleAdminDeleteMenu(deleteTarget);

      if (res.success) {
        setMenus((prev) => prev.filter((m) => m._id !== deleteTarget));
        toast.success("Menu deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete menu");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-800">
              Restaurant Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto space-y-6">
            {loading && (
              <p className="text-center text-gray-500">Loading menu...</p>
            )}

            {!loading && menus.length === 0 && (
              <p className="text-center text-gray-500">
                No menu items available.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menus.map((item) => {
                const imageSrc = getImageSrc(item.imageUrl);

                return (
                  <div
                    key={item._id}
                    className="border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative"
                  >
                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Image */}
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-xl mb-4">
                        No Image Available
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>

                      <span className="font-black text-[#E87A5D]">
                        Rs {item.price}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">
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
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
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
