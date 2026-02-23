import { handleGetAllRestaurants } from "@/lib/actions/restaurant-actions";
import MapWrapper from "./MapWrapper";

export default async function Page() {
  const res = await handleGetAllRestaurants();

  if (!res.success) {
    return <div>Failed to load restaurants</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurant Map</h1>
      <MapWrapper restaurants={res.data} />
    </div>
  );
}