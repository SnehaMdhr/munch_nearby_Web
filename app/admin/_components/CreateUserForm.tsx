"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserData, UserSchema } from "../users/schema";
import { handleCreateUser } from "@/lib/actions/admin/user-actions";

export default function CreateUserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (
    onChange?: (file: File | undefined) => void
  ) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UserData) => {
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("role", data.role);

        if (data.name) formData.append("name", data.name);
        if (data.imageUrl) formData.append("imageUrl", data.imageUrl);

        const response = await handleCreateUser(formData);

        if (!response.success) {
          throw new Error(response.message || "Create profile failed");
        }

        reset();
        handleDismissImage();
        toast.success("Profile Created successfully 🎉");

        // 👉 redirect to users list
        router.push("/admin/users");
      } catch (error: Error | any) {
        toast.error(error.message || "Create profile failed");
        setError(error.message || "Create profile failed");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        max-w-xl bg-white p-6
        rounded-xl border border-gray-200
        shadow-sm space-y-4
      "
    >
      {/* PROFILE IMAGE */}
      <div>
        {previewImage ? (
          <div className="relative w-24 h-24">
            <img
              src={previewImage}
              alt="Profile Preview"
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
                    bg-[#E87A5D] text-white
                    rounded-md text-xs
                    flex items-center justify-center
                    hover:opacity-90 transition
                  "
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border border-dashed border-black/20 bg-[#FFF8F4] flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* IMAGE INPUT */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Profile Image
        </label>
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
              className="
                block w-full text-sm
                file:h-11 file:px-4
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
        {errors.imageUrl && (
          <p className="text-xs text-red-600 mt-1">
            {errors.imageUrl.message}
          </p>
        )}
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          {...register("name")}
          placeholder="Jane"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* ROLE */}
      <div>
        <label className="text-sm font-medium">Role</label>
        <select
          {...register("role")}
          defaultValue=""
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
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
          <option value="Admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-xs text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          {...register("password")}
          type="password"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label className="text-sm font-medium">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="
          h-11 w-full rounded-lg
          bg-[#E87A5D] text-white
          text-sm font-semibold
          hover:opacity-90
          transition
          disabled:opacity-60
        "
      >
        {isSubmitting || pending
          ? "Creating account..."
          : "Create account"}
      </button>
    </form>
  );
}
