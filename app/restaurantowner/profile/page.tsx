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

        <RestaurantProfileForm user={result.data} />
      
        <div className="mt-6 mb-6 space-y-6 max-w-md">
          <Link
          href="/restaurantowner/profile/create"
          className="
            h-11 w-full
            rounded-full
            bg-[#E87A5D]
            text-white
            font-semibold
            hover:opacity-90
            transition
            flex items-center justify-center
          "
        >
          Create Restaurant
        </Link>

        <Link
          href="/restaurantowner/profile/update"
          className="
            h-11 w-full
            rounded-full
            bg-[#E87A5D]
            text-white
            font-semibold
            hover:opacity-90
            transition
            flex items-center justify-center
          "
        >
          Update Restaurant
        </Link>
        </div>
        </div>


      
    </div>
  );
}
