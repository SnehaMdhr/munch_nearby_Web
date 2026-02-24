"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { handleGetMenusByRestaurant } from "@/lib/actions/menu-actions";
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

  const restaurantId =
    typeof params?.id === "string" ? params.id : "";

    const [isAddOpen, setIsAddOpen] = useState(false);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- FETCH MENUS -------------------- */

  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenus = async () => {
      try {
        const res = await handleGetMenusByRestaurant(
          restaurantId
        );

        if (!res.success) {
          setError(
            res.message || "Failed to fetch menus"
          );
          return;
        }

        const parsed = z
          .array(MenuSchema)
          .safeParse(res.data);

        if (!parsed.success) {
          setError(
            "Invalid menu data received from server"
          );
          return;
        }

        setMenus(parsed.data);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  /* -------------------- GROUP BY CATEGORY -------------------- */

  const groupedMenus = useMemo(() => {
    return menus.reduce(
      (acc: Record<string, Menu[]>, menu) => {
        if (!acc[menu.category]) {
          acc[menu.category] = [];
        }
        acc[menu.category].push(menu);
        return acc;
      },
      {}
    );
  }, [menus]);

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Restaurant Menu
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading menus...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : menus.length === 0 ? (
        <p className="text-gray-500">No menus found.</p>
      ) : (
        Object.entries(groupedMenus).map(
          ([category, items]) => (
            <div key={category} className="mb-14">
              
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1.5 bg-[#E87A5D] rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">
                  {category}
                </h2>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((menu) => (
                  <div
                    key={menu._id}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-md transition duration-300 p-6 flex flex-col"
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {menu.name}
                      </h3>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          menu.isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {menu.isAvailable
                          ? "Available"
                          : "Out of Stock"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {menu.description}
                    </p>

                    {/* Bottom Section */}
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-lg font-bold text-[#E87A5D]">
                        Rs {menu.price}
                      </p>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}