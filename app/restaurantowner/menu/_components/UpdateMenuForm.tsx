"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MenuUpdateSchema, MenuUpdateInput } from "../schema";
import { handleUpdateMenu } from "@/lib/actions/menu-actions";

interface UpdateMenuProps {
  menu: any; // Replace 'any' with your actual Menu type from your database/Prisma
}

export default function UpdateMenuForm({ menu }: UpdateMenuProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MenuUpdateInput>({
    resolver: zodResolver(MenuUpdateSchema),
    defaultValues: {
      name: menu.name ?? "",
      price: menu.price ?? 0,
      category: menu.category ?? "",
      description: menu.description ?? "",
      isAvailable: menu.isAvailable ?? true,
    },
  });
  const onSubmit = async (data: MenuUpdateInput) => {
    startTransition(async () => {
      try {
        // Ensure all fields are defined and correct type
        const menuPayload = {
          name: data.name ?? "",
          price: typeof data.price === "number" ? data.price : Number(data.price) || 0,
          category: data.category ?? "",
          description: data.description ?? "",
          isAvailable: typeof data.isAvailable === "boolean" ? data.isAvailable : String(data.isAvailable) === "true",
        };
        const response = await handleUpdateMenu(menu._id, menuPayload);

        if (!response.success) {
          throw new Error(response.message || "Update failed");
        }

        toast.success("Menu updated successfully");
        router.push("/restaurantowner/menu");
        router.refresh();

      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl bg-[#FFF8F4] border border-black/10 rounded-xl p-6 space-y-4 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-800">Update Menu Item</h2>

      {/* --- NAME --- */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* --- PRICE --- */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
          />
          {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>

        {/* --- CATEGORY --- */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <input
            {...register("category")}
            className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
          />
          {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
        </div>
      </div>

      {/* --- DESCRIPTION --- */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-lg border border-black/10 bg-white p-3 text-sm outline-none focus:border-[#E87A5D]"
        />
      </div>

      {/* --- AVAILABILITY --- */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Status</label>
        <select
          {...register("isAvailable")}
          className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-lg bg-[#E87A5D] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {isSubmitting || pending ? "Saving Changes..." : "Update Menu Item"}
      </button>
    </form>
  );
}