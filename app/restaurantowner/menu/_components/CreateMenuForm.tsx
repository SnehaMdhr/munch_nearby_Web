"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MenuData, MenuInput, menuSchema } from "../schema";
import { handleCreateMenu } from "@/lib/actions/menu-actions";

export default function CreateMenuForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MenuInput>({ 
        resolver: zodResolver(menuSchema),
        defaultValues: {
            isAvailable: true,
        }
    });

    const submit = async (data: MenuInput) => {
        startTransition(async () => {
            setError("");
            try {
                // 1. Validate and transform data
                const validatedData = menuSchema.parse(data);

                // 2. Convert object to FormData to satisfy the Server Action type
                    const menuPayload = {
                        name: validatedData.name,
                        price: validatedData.price,
                        category: validatedData.category,
                        description: validatedData.description || "",
                        isAvailable: validatedData.isAvailable,
                    };

                // 3. Call the action
                    const response = await handleCreateMenu(menuPayload);
                
                if (!response.success) {
                    throw new Error(response.message);
                }

                toast.success("Menu Created successfully.");
                router.push("/restaurantowner/menu");

            } catch (err: any) {
                const msg = err.message || 'Menu Creation failed';
                setError(msg);
                toast.error(msg);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter menu name"
                    className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-3 text-sm outline-none focus:border-[#E87A5D]"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Price */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Price</label>
                <input
                    type="number" 
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-3 text-sm outline-none focus:border-[#E87A5D]"
                />
                {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
            </div>

          
            {/* Category */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <input
                    type="text"
                    {...register("category")}
                    placeholder="e.g. Italian"
                    className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-3 text-sm outline-none focus:border-[#E87A5D]"
                />
                {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    {...register("description")}
                    placeholder="Describe the dish..."
                    className="w-full rounded-lg border border-black/10 bg-[#FFF8F4] p-3 text-sm outline-none focus:border-[#E87A5D] min-h-[100px]"
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>

            {/* Availability */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <select
                    {...register("isAvailable")}
                    className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-3 text-sm outline-none focus:border-[#E87A5D]"
                >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-11 w-full rounded-full bg-[#E87A5D] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
                {isSubmitting || pending ? "Creating menu..." : "Create Menu"}
            </button>
        </form>
    );
}