import { handleWhoAmI } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import Sidebar from "../_components/Header";
import RestaurantProfileForm from "./_components/RestaurantProfileForm";
import Link from "next/link";

export default async function Page() {
  const result = await handleWhoAmI();
  if (!result.success) {
    throw new Error("Error");
  }
  if (!result.data) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <RestaurantProfileForm user={result.data} />
      </div>
    </div>
  );
}
