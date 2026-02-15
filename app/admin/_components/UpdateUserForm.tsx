"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { handleUpdateUser } from "@/lib/actions/admin/user-actions";
import { useRouter } from "next/navigation";

export default function UpdateUserForm({ user }: { user: any }) {
  const [pending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<UserData>>({
    resolver: zodResolver(UserSchema.partial()),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      imageUrl: undefined,
    },
  });

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

  const handleDismissImage = (onChange?: (file?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: Partial<UserData>) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.role) formData.append("role", data.role);
        if (data.imageUrl) formData.append("imageUrl", data.imageUrl);

        const response = await handleUpdateUser(user._id, formData);

        if (!response.success) {
          throw new Error(response.message || "Update failed");
        }

        reset({
          name: data.name,
          email: data.email,
          role: data.role,
          imageUrl: undefined,
        });

        handleDismissImage();
        toast.success("Profile updated successfully");
        router.push("/admin/users");

      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        max-w-xl
        bg-[#FFF8F4]
        border border-black/10
        rounded-xl
        p-6
        space-y-4
        shadow-sm
      "
    >
      {/* IMAGE */}
      <div>
        {previewImage ? (
          <div className="relative w-24 h-24">
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border border-black/10"
            />
            <Controller
              name="imageUrl"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => handleDismissImage(onChange)}
                  className="
                    absolute -top-2 -right-2
                    w-6 h-6
                    bg-[#E87A5D]
                    text-white
                    rounded-md
                    text-xs
                    flex items-center justify-center
                    hover:opacity-90
                  "
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : user.imageUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE}${user.imageUrl}`}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-lg object-cover border border-black/10"
          />
        ) : (
          <div className="w-24 h-24 rounded-lg bg-[#FFF8F4] border border-dashed border-black/20 flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* IMAGE INPUT */}
      <Controller
        name="imageUrl"
        control={control}
        render={({ field: { onChange } }) => (
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) =>
              handleImageChange(e.target.files?.[0], onChange)
            }
            className="
              block w-full text-sm
              file:h-10 file:px-4
              file:rounded-md
              file:border-0
              file:bg-[#E87A5D]
              file:text-white
              hover:file:opacity-90
              transition
            "
          />
        )}
      />

      {/* NAME */}
      <input
        {...register("name")}
        placeholder="Name"
        className="
          h-11 w-full rounded-lg
          border border-black/10
          bg-white
          px-3 text-sm
          outline-none
          focus:border-[#E87A5D]
        "
      />
      {errors.name && (
        <p className="text-xs text-red-600">{errors.name.message}</p>
      )}

      {/* EMAIL */}
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="
          h-11 w-full rounded-lg
          border border-black/10
          bg-white
          px-3 text-sm
          outline-none
          focus:border-[#E87A5D]
        "
      />
      {errors.email && (
        <p className="text-xs text-red-600">{errors.email.message}</p>
      )}

      {/* ROLE */}
      <select
        {...register("role")}
        className="
          h-11 w-full rounded-lg
          border border-black/10
          bg-white
          px-3 text-sm
          outline-none
          focus:border-[#E87A5D]
        "
      >
        <option value="" disabled>
          Select role
        </option>
        <option value="Customer">Customer</option>
        <option value="Restaurant Owner">Restaurant Owner</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && (
        <p className="text-xs text-red-600">{errors.role.message}</p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="
          h-11 w-full rounded-lg
          bg-[#E87A5D]
          text-white
          text-sm font-semibold
          hover:opacity-90
          transition
          disabled:opacity-60
        "
      >
        {isSubmitting || pending ? "Updating..." : "Update User"}
      </button>
    </form>
  );
}
