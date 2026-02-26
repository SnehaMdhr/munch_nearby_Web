"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const updateUserSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email"),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPG, PNG or WEBP allowed",
    }),
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function RestaurantProfileForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const removeImage = (onChange?: (file?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.image) formData.append("image", data.image);

      const res = await handleUpdateProfile(formData);

      if (!res.success) throw new Error(res.message);

      toast.success("Profile updated successfully 🎉");
      removeImage();
    } catch (err: any) {
      toast.error(err.message || "Profile update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-md p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Restaurant Profile
        </h1>
        <p className="text-gray-500 mb-8">
          Manage your restaurant information and account details.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo Section */}
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative w-24 h-24">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : user?.imageUrl ? (
                <Image
                  src={process.env.NEXT_PUBLIC_API_BASE + user.imageUrl}
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
                name="image"
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

              {errors.image && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Restaurant Name
            </label>
            <input
              {...register("name")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-5 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <input
              {...register("email")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-5 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border border-gray-300
                       text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 
                       py-2 px-6 text-white text-xs font-semibold 
                       rounded-xl transition shadow-sm
                       bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                       hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
