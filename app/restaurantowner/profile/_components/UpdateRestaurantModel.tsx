"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
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
    formState: { errors, isSubmitting },
  } = useForm<UpdateRestaurantData>({
    resolver: zodResolver(updateRestaurantSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= RESET FORM WHEN MODAL OPENS ================= */

  useEffect(() => {
    if (restaurant && isOpen) {
      reset({
        name: restaurant.name || "",
        address: restaurant.address || "",
        mapLink: restaurant.mapLink || "",
        contactNumber: restaurant.contactNumber || "",
        category: restaurant.category || "",
        description: restaurant.description || "",
      });

      setPreviewImage(null);
    }
  }, [restaurant, isOpen, reset]);

  if (!isOpen) return null;

  /* ================= IMAGE HANDLING ================= */

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

  /* ================= SUBMIT ================= */

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

      const res = await handleUpdateRestaurant(formData);

      if (!res.success) throw new Error(res.message);

      toast.success("Restaurant updated successfully 🎉");

      onSuccess();
      onClose();
      removeImage();
    } catch (err: any) {
      toast.error(err.message || "Restaurant update failed");
    }
  };

  /* ================= UI ================= */

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

      {/* TOP HEADER STRIP */}
      <div className="bg-linear-to-r from-[#E87A5D]/10 to-[#F6B88F]/20 px-8 py-6 border-b border-[#E87A5D]/20">
        <h2 className="text-2xl font-bold text-gray-800">
          Update Restaurant
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit your restaurant details and keep information updated.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 space-y-8 max-h-[75vh] overflow-y-auto"
      >

        {/* IMAGE SECTION */}
        <div className="flex items-center gap-8 bg-[#FFF8F4] p-6 rounded-2xl border border-[#E87A5D]/10">
          
          <div className="relative w-24 h-24">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : restaurant?.imageUrl ? (
                        <Image
                          src={process.env.NEXT_PUBLIC_API_BASE + restaurant.imageUrl}
                          alt="Profile"
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
          
                    {/* Upload Controls */}
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">
                        Restaurant Photo
                      </p>
                      <p className="text-sm text-gray-400 mb-3">
                        JPG, PNG or WEBP. Max size 5MB
                      </p>
          
                      <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field: { onChange } }) => (
                          <>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              hidden
                              onChange={(e) =>
                                handleImageChange(e.target.files?.[0], onChange)
                              }
                            />
          
                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-5 py-2 rounded-xl 
                                           bg-[#E87A5D]/10 text-[#E87A5D] 
                                           font-medium hover:bg-[#E87A5D]/20 transition"
                              >
                                Upload New Photo
                              </button>
          
                              <button
                                type="button"
                                onClick={() => removeImage(onChange)}
                                className="text-gray-500 hover:text-red-500 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      />
          
                      {errors.imageUrl && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.imageUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 gap-6">

          <div>
            <label className="text-sm font-medium text-gray-600">
              Restaurant Name
            </label>
            <input
              {...register("name")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Contact Number
            </label>
            <input
              {...register("contactNumber")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              {...register("address")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Google Map Link
            </label>
            <input
              {...register("mapLink")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Category
            </label>
            <input
              {...register("category")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 px-4 py-3 resize-none text-sm outline-none focus:border-[#E87A5D]"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 pt-6 border-t border-black/5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl  text-white text-xs font-semibold transition shadow-sm
                               bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                               hover:opacity-90"
          >
            {isSubmitting ? "Updating..." : "Update Restaurant"}
          </button>
        </div>

      </form>
    </div>
  </div>
);
}