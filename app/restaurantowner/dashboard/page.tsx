import DashboardClient from "./_components/DashboardClient";
import { redirect } from "next/navigation";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";

export default async function Page() {
  try {
    const response = await handleGetMyRestaurant();

    if (!response.success || !response.data) {
      redirect("/restaurantowner/profile");
    }

    const restaurant = response.data;
    const menuCount = restaurant.menus?.length || restaurant.menu?.length || 0;
    const reviews = restaurant.reviews || [];

    if (!restaurant) {
      console.error("[Dashboard] No restaurant data");
      redirect("/restaurantowner/profile");
    }

    return (
      <DashboardClient
        restaurant={restaurant}
        menuCount={menuCount}
        reviews={reviews}
      />
    );
  } catch (error) {
    console.error("[Dashboard] Exception:", error);
    redirect("/restaurantowner/profile");
  }
}
