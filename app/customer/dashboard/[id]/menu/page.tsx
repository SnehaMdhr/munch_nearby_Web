"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { handleGetMenusByRestaurant } from "@/lib/actions/menu-actions";
import Sidebar from "@/app/customer/_components/SideBar";

interface Menu {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  isAvailable: boolean;
}

export default function Page() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      if (!restaurantId) return;

      const res = await handleGetMenusByRestaurant(restaurantId);

      if (res.success) {
        setMenus(res.data);
      } else {
        setError(res.message || "Failed to fetch menus");
      }

      setLoading(false);
    };

    fetchMenus();
  }, [restaurantId]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold">Restaurant Menus</h1>

        <div className="mt-6">
          {loading ? (
            <p>Loading menus...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : menus.length === 0 ? (
            <p>No menus found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu._id}
                  className="border rounded-lg shadow p-4 bg-white"
                >
                  <h3 className="text-lg font-semibold">{menu.name}</h3>

                  <p className="text-gray-500 text-sm">
                    {menu.category}
                  </p>

                  <p className="mt-2 text-gray-700">
                    {menu.description}
                  </p>

                  <p className="mt-2 font-bold">
                    ₹ {menu.price}
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      menu.isAvailable
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {menu.isAvailable
                      ? "Available"
                      : "Out of Stock"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
