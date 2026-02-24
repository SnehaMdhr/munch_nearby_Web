import Sidebar from "../../_components/SideBar";
import Tabs from "./_components/Tab";
import { getRestaurantById } from "@/lib/api/restaurant";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch restaurant
  let restaurant = null;
  try {
    restaurant = await getRestaurantById(id);
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-60 flex-1 bg-gray-50 min-h-screen">
        
        {/* 🔥 Restaurant Header */}
        {restaurant && (
          <div className="bg-white shadow-sm p-6 border-b">
            <h1 className="text-2xl font-bold">
              {restaurant.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {restaurant.address || restaurant.location}
            </p>
            {restaurant.description && (
              <p className="text-sm text-gray-400 mt-2">
                {restaurant.description}
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs id={id} />

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}