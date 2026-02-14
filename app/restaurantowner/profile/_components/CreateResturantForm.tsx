"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleCreateRestaurant } from "@/lib/actions/restaurant-actions";
import { RestaurantData, restaurantSchema } from "../restaurantschema";

export default function CreateRestaurantForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantData>({
    resolver: zodResolver(restaurantSchema),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = async (values: RestaurantData) => {
    startTransition(async () => {
      try {
        setError("");

        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("mapLink", values.mapLink || "");
        formData.append("contactNumber", values.contactNumber);
        formData.append("category", values.category || "");
        formData.append("description", values.description || "");

        if (imageFile) {
          formData.append("imageUrl", imageFile); // must match multer
        }

        const response = await handleCreateRestaurant(formData);

        if (!response.success) {
          throw new Error(response.message);
        }

        router.refresh();
        router.push("/restaurantowner/profile");

      } catch (err: any) {
        setError(err.message || "Failed to create restaurant");
      }
    });
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create Restaurant
      </h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 text-sm outline-none
            focus:border-[#E87A5D]"
        />
        {errors.name && (
          <p className="text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Address
        </label>
        <input
          {...register("address")}
          className="h-11 w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 text-sm outline-none
            focus:border-[#E87A5D]"
        />
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Contact Number
        </label>
        <input
          {...register("contactNumber")}
          className="h-11 w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 text-sm outline-none
            focus:border-[#E87A5D]"
        />
      </div>

      {/* Map Link */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Google Map Link
        </label>
        <input
          {...register("mapLink")}
          className="h-11 w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 text-sm outline-none
            focus:border-[#E87A5D]"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Category
        </label>
        <input
          {...register("category")}
          className="h-11 w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 text-sm outline-none
            focus:border-[#E87A5D]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full rounded-lg border border-black/10
            bg-[#FFF8F4] px-3 py-2 text-sm outline-none
            focus:border-[#E87A5D]"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Restaurant Image
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="block w-full text-sm
            file:mr-4 file:rounded-full file:border-0
            file:bg-[#E87A5D]/10 file:px-4 file:py-2
            file:text-[#E87A5D] hover:file:bg-[#E87A5D]/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-full bg-[#E87A5D]
          text-white font-semibold hover:opacity-90
          transition disabled:opacity-60"
      >
        {isSubmitting || pending
          ? "Creating..."
          : "Create Restaurant"}
      </button>
    </form>
    </div>


  );
}
