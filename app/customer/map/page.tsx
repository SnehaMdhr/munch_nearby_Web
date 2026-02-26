import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";

import MapWrapper from "./MapWrapper";
import Header from "../_components/Header";

export default async function Page() {
  const res = await handleGetAllRestaurants();

  if (!res.success) {
    return (
      <div className="flex">
        <Header />
        <div className="flex-1 p-10 text-red-500">
          Failed to load restaurants
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      {/* Main Content */}
      <div className="p-0">
        {/* Map Section */}
        <MapWrapper restaurants={res.data} />
      </div>
    </div>
  );
}
