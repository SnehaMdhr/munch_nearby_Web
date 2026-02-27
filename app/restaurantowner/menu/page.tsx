"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";
import {
  handleDeleteMenu,
  handleGetMenusByRestaurant,
} from "@/lib/actions/menu-actions";
import DeleteModal from "@/app/_components/DeleteModel";
import UpdateMenuForm from "./_components/UpdateMenuForm";
import CreateMenuForm from "./_components/CreateMenuForm";
import Header from "../_components/Header";

export default function Page() {
  const router = useRouter();

  const resolveIsAvailable = (menu: any) => {
    if (typeof menu?.isAvailable !== "undefined") {
      return Boolean(menu.isAvailable);
    }
    if (typeof menu?.notAvailable !== "undefined") {
      return !Boolean(menu.notAvailable);
    }
    return true;
  };

  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Delete Modal State
  const [isFormOpen, setIsFormOpen] = useState(false); // Create Form State
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); // Update Form State
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  /* ---------------- FETCH MENUS ---------------- */

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    const restaurantRes = await handleGetMyRestaurant();
    if (!restaurantRes.success) {
      setLoading(false);
      return;
    }

    const restaurant = restaurantRes.data;
    const menuRes = await handleGetMenusByRestaurant(restaurant._id);
    if (!menuRes.success) {
      setLoading(false);
      return;
    }

    setMenus(menuRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  /* ---------------- GROUP BY CATEGORY ---------------- */

  const groupedMenus = useMemo(() => {
    return menus.reduce((acc: any, menu: any) => {
      if (!acc[menu.category]) acc[menu.category] = [];
      acc[menu.category].push(menu);
      return acc;
    }, {});
  }, [menus]);

  /* ---------------- DELETE ---------------- */

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await handleDeleteMenu(deleteId);
    if (res.success) {
      setMenus((prev) => prev.filter((m) => m._id !== deleteId));
      setIsOpen(false);
      setDeleteId(null);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      <Header />

      <div className="p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Menu Management
            </h1>
            <p className="text-gray-500 mt-2">
              Organize and manage your restaurant's digital menu
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedMenu(null);
              setIsFormOpen(true);
            }}
            className="px-5 py-2 rounded-xl bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-medium shadow-md hover:scale-105 transition"
          >
            + Add Menu Item
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading menus...</p>
        ) : menus.length === 0 ? (
          <p className="text-gray-500">No menus found.</p>
        ) : (
          Object.entries(groupedMenus).map(([category, items]: any) => (
            <div key={category} className="mb-14">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-6 w-1.5 bg-[#E87A5D] rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">{category}</h2>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((menu: any) => {
                  const available = resolveIsAvailable(menu);

                  return (
                    <div
                      key={menu._id}
                      className="bg-white rounded-3xl shadow-sm hover:shadow-md transition duration-300 p-6 flex flex-col"
                    >
                      <div className="relative w-full h-40 overflow-hidden">
                        {menu.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE}${menu.imageUrl}`}
                            alt={menu.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Top Section */}
                      <div className="flex justify-between items-start mt-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {menu.name}
                        </h3>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            available
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {available ? "Available" : "Not Available"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {menu.description}
                      </p>

                      {/* Price */}
                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-lg font-bold text-[#E87A5D]">
                          Rs {menu.price}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedMenu(menu);
                            setIsUpdateOpen(true);
                          }}
                          className="flex-1 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-sm font-medium"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => handleDeleteClick(menu._id)}
                          className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* --- MODALS --- */}

        <CreateMenuForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchMenus}
        />

        <UpdateMenuForm
          key={selectedMenu?._id} // Reset state when ID changes
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={() => {
            setIsUpdateOpen(false);
            fetchMenus();
          }}
          menu={selectedMenu}
        />

        <DeleteModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Menu Item"
          description="Are you sure you want to delete this menu item?"
        />
      </div>
    </div>
  );
}
