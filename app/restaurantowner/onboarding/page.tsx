"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantOnboardingModal from "../_components/RestaurantOnboardingModal";
import { handleGetMyRestaurant } from "@/lib/actions/restaurant-actions";

export default function RestaurantOnboardingPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const result = await handleGetMyRestaurant();

      if (!mounted) return;

      if (result.success && result.data) {
        router.replace("/restaurantowner/dashboard");
        return;
      }
      setOpen(true);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F4]">
        <p className="text-slate-600">Checking your restaurant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F4]">
      <RestaurantOnboardingModal
        open={open}
        onClose={() => {
          return;
        }}
        onCreated={() => {
          router.replace("/restaurantowner/dashboard");
        }}
      />
    </div>
  );
}
