import { handleWhoAmI } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import Sidebar from "../_components/SideBar";
import RestaurantProfileForm from "./_components/RestaurantProfileForm";
import Link from "next/link";

export default async function Page() {
  const result = await handleWhoAmI();
    if(!result.success){
        throw new Error("Error");
    }
    if(!result.data){
        notFound();
    }
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Link
          href="/restaurantowner/profile/create"
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Create Restaurant
        </Link>

        <Link
          href="/restaurantowner/profile/update"
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Update Restaurant
        </Link>


        <RestaurantProfileForm user={result.data} />
        


      </div>
    </div>
  );
}
