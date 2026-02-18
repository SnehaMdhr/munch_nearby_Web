"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { handleGetMenusByRestaurant } from "@/lib/actions/menu-actions";
import Sidebar from "@/app/customer/_components/SideBar";
import { z } from "zod";

/* -------------------- ZOD SCHEMA -------------------- */

const MenuSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  description: z.string(),
  image: z.string().optional(),
  isAvailable: z.boolean(),
});

type Menu = z.infer<typeof MenuSchema>;

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
        const parsed = z.array(MenuSchema).safeParse(res.data);

        if (parsed.success) {
          setMenus(parsed.data);
        } else {
          setError("Invalid menu data received from server");
        }
      } else {
        setError(res.message || "Failed to fetch menus");
      }

      setLoading(false);
    };

    fetchMenus();
  }, [restaurantId]);

  /* -------------------- GROUP BY CATEGORY -------------------- */

  const groupedMenus = useMemo(() => {
    return menus.reduce((acc: Record<string, Menu[]>, menu) => {
      if (!acc[menu.category]) {
        acc[menu.category] = [];
      }
      acc[menu.category].push(menu);
      return acc;
    }, {});
  }, [menus]);

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
            Object.entries(groupedMenus).map(([category, items]) => (
              <div key={category} className="mb-10">
                {/* Category Title */}
                <h2 className="text-lg font-bold mb-4 border-b pb-2">
                  {category}
                </h2>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {items.map((menu) => (
                    <div
                      key={menu._id}
                      className="border rounded-lg shadow p-4 bg-white"
                    >
                      <h3 className="text-lg font-semibold">
                        {menu.name}
                      </h3>

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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
