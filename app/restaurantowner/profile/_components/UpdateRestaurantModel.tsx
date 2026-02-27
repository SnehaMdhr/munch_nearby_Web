"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateRestaurant } from "@/lib/actions/restaurant-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const updateRestaurantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  mapLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactNumber: z.string().min(5, "Contact number is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  openingHours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
      isClosed: z.boolean(),
    }),
  ),
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

interface Props {
  restaurant: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateRestaurantModal({
  restaurant,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRestaurantData>({
    resolver: zodResolver(updateRestaurantSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchedHours = watch("openingHours") || [];

  useEffect(() => {
    if (restaurant && isOpen) {
      reset({
        name: restaurant.name || "",
        address: restaurant.address || "",
        mapLink: restaurant.mapLink || "",
        contactNumber: restaurant.contactNumber || "",
        category: restaurant.category || "",
        description: restaurant.description || "",
        openingHours:
          restaurant.openingHours?.length > 0
            ? restaurant.openingHours
            : DAYS_OF_WEEK.map((day) => ({
                day,
                open: "09:00",
                close: "21:00",
                isClosed: false,
              })),
      });
      setPreviewImage(null);
    }
  }, [restaurant, isOpen, reset]);

  if (!isOpen) return null;

  const handleImageChange = (
    file: File | undefined,
    onChange: (file?: File) => void,
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

  const onSubmit = async (data: UpdateRestaurantData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("contactNumber", data.contactNumber);
      formData.append("mapLink", data.mapLink || "");
      formData.append("category", data.category || "");
      formData.append("description", data.description || "");
      formData.append("openingHours", JSON.stringify(data.openingHours));

      if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }

      const res = await handleUpdateRestaurant(formData);
      if (!res.success) throw new Error(res.message);

      toast.success("Restaurant updated successfully 🎉");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-orange-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
              Update{" "}
              <span className="text-orange-500 underline decoration-orange-200">
                Restaurant
              </span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Manage your business profile and scheduling.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Section 1: Visual Identity */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center text-center">
              <div
                className="size-24 rounded-full bg-white border-4 border-orange-100 overflow-hidden flex items-center justify-center shadow-inner cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : restaurant?.imageUrl ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_API_BASE + restaurant.imageUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl">📸</span>
                )}
              </div>

              <Controller
                name="imageUrl"
                control={control}
                render={({ field: { onChange } }) => (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(e.target.files?.[0], onChange)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700"
                    >
                      Change Photo
                    </button>
                  </>
                )}
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Restaurant Name *
                </label>
                <input
                  {...register("name")}
                  className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all"
                  placeholder="e.g. Kathmandu Kitchen"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Category
                </label>
                <input
                  {...register("category")}
                  className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all"
                  placeholder="e.g. Italian, Bakery, Newari"
                />
              </div>
            </div>
          </section>
          {/* Section 2: Details */}
          <section className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all resize-none"
                placeholder="Tell us your story..."
              />
            </div>
          </section>
          {/* Section 3: Scheduling */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 rounded-lg text-amber-600 text-xs font-bold">
                SCHEDULING
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Opening Hours
              </h3>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-slate-50/50 p-4 space-y-3">
              {watchedHours.map((oh, index) => (
                <div
                  key={oh.day}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <span className="col-span-3 text-xs font-bold text-slate-600">
                    {oh.day}
                  </span>

                  <div className="col-span-6 flex items-center gap-2">
                    <input
                      type="time"
                      disabled={oh.isClosed}
                      {...register(`openingHours.${index}.open`)}
                      className="w-full rounded-lg border border-amber-200 px-2 py-1.5 text-xs font-medium text-amber-700 accent-amber-500 [color-scheme:light] focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 transition-all cursor-pointer"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="time"
                      disabled={oh.isClosed}
                      {...register(`openingHours.${index}.close`)}
                      className="w-full rounded-lg border border-amber-200 px-2 py-1.5 text-xs text-amber-700 accent-amber-500 [color-scheme:light] focus:ring-2 focus:ring-amber-200 outline-none disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                    />
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register(`openingHours.${index}.isClosed`)}
                        className="w-4 h-4 accent-amber-500 rounded border-gray-300"
                      />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-amber-600 uppercase transition-colors">
                        Closed
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Section 4: Contact & Location */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Phone Number *
              </label>
              <input
                {...register("contactNumber")}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-all"
                placeholder="+977 98..."
              />
              {errors.contactNumber && (
                <p className="text-xs text-red-500">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Google Maps Link
              </label>
              <input
                {...register("mapLink")}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-all"
                placeholder="https://goo.gl/maps/..."
              />
              {errors.mapLink && (
                <p className="text-xs text-red-500">{errors.mapLink.message}</p>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Street Address *
              </label>
              <input
                {...register("address")}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-all"
                placeholder="e.g. Lazimpat, Kathmandu"
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>
          </section>
          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-orange-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 items-center justify-center py-3 px-6 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-orange-100 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Saving Changes..." : "Update Restaurant Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
