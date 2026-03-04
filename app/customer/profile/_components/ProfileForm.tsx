"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
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

interface ProfileFormProps {
  user: {
    name?: string;
    email?: string;
    imageUrl?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProfileForm({
  user,
  onSuccess,
  onCancel,
}: ProfileFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialPreview = () => {
    if (!user?.imageUrl) return null;
    return user.imageUrl.startsWith("http")
      ? user.imageUrl
      : `${process.env.NEXT_PUBLIC_API_BASE}${user.imageUrl}`;
  };

  const [previewImage, setPreviewImage] = useState<string | null>(
    getInitialPreview(),
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const handleImageChange = (
    file: File | undefined,
    onChange: (file?: File) => void,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const removeImage = (onChange?: (file?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    setError("");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);

        if (data.image) {
          formData.append("image", data.image);
        }

        const res = await handleUpdateProfile(formData);

        if (!res?.success) {
          throw new Error(res?.message || "Update failed");
        }

        toast.success("Profile updated successfully!");
        onSuccess?.();
      } catch (err: any) {
        setError(err?.message || "Profile update failed");
        toast.error(err?.message || "Profile update failed");
      }
    });
  };

  const handleCancelAction = () => {
    reset();
    setPreviewImage(getInitialPreview());
    onCancel?.();
  };

  return (
    <>
      <div className="flex mb-5 justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            Profile <span className="text-orange-500">Settings</span>
          </h2>
          <p className="text-sm text-slate-500">
            Manage your account information and preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <section
              className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center cursor-pointer hover:bg-orange-100/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="size-24 rounded-full bg-white border-2 border-orange-100 overflow-hidden flex items-center justify-center shadow-inner relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0], onChange)
                }
              />
              <div className="flex gap-3 mt-2">
                <p className="text-xs font-bold text-orange-600">
                  {previewImage ? "Change Photo" : "Upload Photo"}
                </p>
                {previewImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(onChange);
                    }}
                    className="text-xs font-bold text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.image.message}
                </p>
              )}
            </section>
          )}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Full Name *
            </label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              readOnly
              className="rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-500 cursor-not-allowed outline-none"
            />
            <p className="text-[10px] text-slate-400 italic">
              Email cannot be changed.
            </p>
          </div>
        </div>

        {error && (
          <p className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancelAction}
            className="flex-1 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="flex-1 py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
          >
            {isSubmitting || pending ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </>
  );
}
