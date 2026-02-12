"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateRestaurant } from "@/lib/actions/restaurant-actions";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateRestaurantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  mapLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactNumber: z.string().min(5, "Contact number is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPG, JPEG, PNG or WEBP formats are supported",
    }),
});

export type UpdateRestaurantData = z.infer<typeof updateRestaurantSchema>;

/* ---------------- COMPONENT ---------------- */

export default function UpdateRestaurantForm({
  restaurant,
}: {
  restaurant: any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRestaurantData>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      name: restaurant?.name || "",
      address: restaurant?.address || "",
      mapLink: restaurant?.mapLink || "",
      contactNumber: restaurant?.contactNumber || "",
      category: restaurant?.category || "",
      description: restaurant?.description || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------- IMAGE HANDLING -------- */

  const handleImageChange = (
    file: File | undefined,
    onChange: (file?: File) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const removeImage = (onChange?: (file?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* -------- SUBMIT -------- */

  const onSubmit = async (data: UpdateRestaurantData) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("contactNumber", data.contactNumber);
      formData.append("mapLink", data.mapLink || "");
      formData.append("category", data.category || "");
      formData.append("description", data.description || "");

      if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }

      // ✅ FIXED: pass restaurant ID only
      const res = await handleUpdateRestaurant(
        restaurant?.id || restaurant?._id,
        formData
      );

      if (!res.success) throw new Error(res.message);

      toast.success("Restaurant updated successfully 🎉");
      removeImage();
    } catch (err: any) {
      toast.error(err.message || "Restaurant update failed");
    }
  };

  /* -------- UI -------- */

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Update Restaurant
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Preview */}
        <div className="flex items-center gap-4">
          {previewImage ? (
            <div className="relative w-16 h-16">
              <img
                src={previewImage}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <Controller
                name="imageUrl"
                control={control}
                render={({ field: { onChange } }) => (
                  <button
                    type="button"
                    onClick={() => removeImage(onChange)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                      bg-red-500 text-white text-[10px] flex items-center
                      justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              />
            </div>
          ) : restaurant?.imageUrl ? (
            <Image
              src={
                process.env.NEXT_PUBLIC_API_BASE + restaurant.imageUrl
              }
              alt="Restaurant"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Image Input */}
        <Controller
          name="imageUrl"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                handleImageChange(e.target.files?.[0], onChange)
              }
              className="block w-full text-sm
                file:mr-4 file:rounded-full file:border-0
                file:bg-[#E87A5D]/10 file:px-4 file:py-2
                file:text-[#E87A5D] hover:file:bg-[#E87A5D]/20"
            />
          )}
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-600">
            {errors.imageUrl.message}
          </p>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="h-11 w-full rounded-lg border border-black/10
              bg-[#FFF8F4] px-3 text-sm outline-none
              focus:border-[#E87A5D]"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            {...register("address")}
            className="h-11 w-full rounded-lg border border-black/10
              bg-[#FFF8F4] px-3 text-sm outline-none
              focus:border-[#E87A5D]"
          />
          {errors.address && (
            <p className="text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
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
          {errors.contactNumber && (
            <p className="text-sm text-red-600">
              {errors.contactNumber.message}
            </p>
          )}
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
          {errors.mapLink && (
            <p className="text-sm text-red-600">
              {errors.mapLink.message}
            </p>
          )}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-[#E87A5D]
            text-white font-semibold hover:opacity-90
            transition disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Restaurant"}
        </button>
      </form>
    </div>
  );  
}
