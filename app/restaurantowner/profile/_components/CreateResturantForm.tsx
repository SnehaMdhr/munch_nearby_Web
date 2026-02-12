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
    <form onSubmit={handleSubmit(submit)} className="space-y-5">

      {/* Name */}
      <div>
        <label className="text-sm font-medium">Restaurant Name</label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-lg border px-3 text-sm"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="text-sm font-medium">Address</label>
        <input
          {...register("address")}
          className="h-11 w-full rounded-lg border px-3 text-sm"
        />
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Contact */}
      <div>
        <label className="text-sm font-medium">Contact Number</label>
        <input
          {...register("contactNumber")}
          className="h-11 w-full rounded-lg border px-3 text-sm"
        />
        {errors.contactNumber && (
          <p className="text-xs text-red-500">{errors.contactNumber.message}</p>
        )}
      </div>

      {/* Map Link */}
      <div>
        <label className="text-sm font-medium">Google Map Link</label>
        <input
          {...register("mapLink")}
          className="h-11 w-full rounded-lg border px-3 text-sm"
        />
        {errors.mapLink && (
          <p className="text-xs text-red-500">{errors.mapLink.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <input
          {...register("category")}
          className="h-11 w-full rounded-lg border px-3 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      {/* Image */}
      <div>
        <label className="text-sm font-medium">Restaurant Image</label>
        <input
          type="file"
          accept="imageUrl/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-full bg-[#E87A5D] text-white font-semibold disabled:opacity-60"
      >
        {isSubmitting || pending
          ? "Creating Restaurant..."
          : "Create Restaurant"}
      </button>
    </form>
  );
}
