"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  location?: { type: "Point"; coordinates: [number, number] };
};

type MapClientProps = {
  restaurantId: string | null;
  restaurants: Restaurant[]; // ✅ keep list only for lookup
};

const RestaurantMapClient = dynamic<MapClientProps>(
  () => import("./RestaurantMapClient"),
  { ssr: false }
);

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  restaurantId: string | null;      
  restaurants: Restaurant[];         
};

export default function RestaurantMapSheet({
  open,
  onOpenChange,
  restaurantId,
  restaurants,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.aside
            className="fixed right-0 top-0 z-[1000] h-[100dvh] w-full sm:w-[520px] lg:w-[640px] bg-white shadow-2xl border-l border-black/10 flex flex-col"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-5 border-b border-black/10">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Restaurant Map</h2>
                <p className="text-sm text-gray-600">Showing selected restaurant.</p>
              </div>

              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
                aria-label="Close map"
              >
                <X />
              </button>
            </div>

            <div className="flex-1">
              <RestaurantMapClient restaurantId={restaurantId} restaurants={restaurants} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}