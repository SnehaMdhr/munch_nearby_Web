import { getMyRestaurant } from "@/lib/api/restaurant";
import UpdateRestaurantForm from "../_components/UpdateRestaurantForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const result = await getMyRestaurant();
      if(!result.success){
          throw new Error("Error");
      }
      if(!result.data){
          notFound();
      }

  return (
    <div>
      <UpdateRestaurantForm restaurant={result.data} />
    </div>
  );
}
