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



export default function ProfileForm({ user }: { user: any }) {
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
    <div className="max-w-xl">
    <h1 className="text-2xl font-bold mb-6 text-gray-800">
    Profile
    </h1>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image */}
        <div className="flex items-center gap-4">
        {previewImage ? (
        <div className="relative w-16 h-16">
            <img
            src={previewImage}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border"
            />
            <Controller
            name="image"
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
        ) : user?.imageUrl ? (
        <Image
            src={process.env.NEXT_PUBLIC_API_BASE + user.imageUrl}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border"
        />
        ) : (
        <div className="w-16 h-16 rounded-full bg-gray-200
            flex items-center justify-center text-xs text-gray-500">
            No Image
        </div>
        )}
        </div>

        {/* Image Input */}
        <Controller
          name="image"
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
        {errors.image && (
          <p className="text-sm text-red-600">
            {errors.image.message}
          </p>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            {...register("email")}
            className="h-11 w-full rounded-lg border border-black/10
              bg-[#FFF8F4] px-3 text-sm outline-none
              focus:border-[#E87A5D]"
          />
          {errors.email && (
            <p className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-[#E87A5D]
            text-white font-semibold hover:opacity-90
            transition disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
