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
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 min-h-0">
        <MapWrapper restaurants={res.data} />
      </div>
    </div>
  );
}
