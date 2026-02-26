import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import MapWrapper from "./MapWrapper";
import Sidebar from "../_components/SideBar";

export default async function Page() {
  const res = await handleGetAllRestaurants();

  if (!res.success) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10 text-red-500">
          Failed to load restaurants
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F6F4]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Map Section */}
        <MapWrapper restaurants={res.data} />

      </div>
    </div>
  );
}