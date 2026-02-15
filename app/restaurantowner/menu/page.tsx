"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";
import { handleDeleteMenu, handleGetMenusByRestaurant } from "@/lib/actions/menu-actions";
import DeleteModal from "@/app/_components/DeleteModel";
import Sidebar from "../_components/SideBar";

export default function page() {
  const [menus, setMenus] = useState<any[]>([]);
  const [groupedMenus, setGroupedMenus] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // ✅ Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      const restaurantRes = await handleGetMyRestaurant();
      if (!restaurantRes.success) return;

      const restaurant = restaurantRes.data;

      const menuRes = await handleGetMenusByRestaurant(restaurant._id);
      if (!menuRes.success) return;

      setMenus(menuRes.data);
    };

    fetchMenus();
  }, []);

  // ✅ Group by category
  useEffect(() => {
    const grouped = menus.reduce((acc: any, menu: any) => {
      if (!acc[menu.category]) {
        acc[menu.category] = [];
      }
      acc[menu.category].push(menu);
      return acc;
    }, {});
    setGroupedMenus(grouped);
  }, [menus]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const res = await handleDeleteMenu(deleteId);

    if (res.success) {
      setMenus(prev => prev.filter(menu => menu._id !== deleteId));
      setIsOpen(false);
      setDeleteId(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 p-8 ml-64">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Menu Management</h1>

          <button
            onClick={() => router.push("/restaurantowner/menu/create")}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            + Add Menu
          </button>
        </div>

        {/* If no menus */}
        {Object.keys(groupedMenus).length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No menu items found.
          </div>
        )}

        {/* Categories */}
        {Object.keys(groupedMenus).map((category) => (
          <div
            key={category}
            className="mb-10 bg-white p-6 rounded-xl shadow-md"
          >
            {/* Category Title */}
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">
              {category}
            </h2>

            {/* Menu Items */}
            {groupedMenus[category].map((menu: any) => (
              <div
                key={menu._id}
                className="flex items-center justify-between border p-4 rounded-lg mb-4 hover:shadow transition"
              >
                <div>
                  <p className="font-semibold text-lg">{menu.name}</p>
                  <p className="text-sm text-gray-500">
                    {menu.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <p className="font-bold text-gray-700">
                    Rs. {menu.price}
                  </p>

                  <button
                    onClick={() => router.push(`/restaurantowner/menu/${menu._id}/update`)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteClick(menu._id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Delete Modal */}
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
