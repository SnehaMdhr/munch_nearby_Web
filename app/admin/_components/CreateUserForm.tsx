"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserData, UserSchema } from "../users/schema";
import { handleCreateUser } from "@/lib/actions/admin/user-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface CreateUserFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CreateUserForm({
  onSuccess,
  isOpen,
  onClose,
}: CreateUserFormProps) {
  const isModalMode = typeof isOpen === "boolean";
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
  });

  if (isModalMode && !isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG or WEBP formats are supported");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewImage(null);
    setSelectedFile(null);
    onClose?.();
  };

  const submit = async (data: UserData) => {
    startTransition(async () => {
      setError("");
      try {
        const formData = new FormData();
        formData.append("name", data.name || "");
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("role", data.role);

        if (selectedFile) formData.append("imageUrl", selectedFile);

        const response = await handleCreateUser(formData);
        if (!response.success) throw new Error(response.message);

        toast.success("User profile created successfully!");
        handleClose();

        if (onSuccess) {
          onSuccess();
        } else if (!isModalMode) {
          router.push("/admin/users");
        }
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to create user");
      }
    });
  };

  const formContent = (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            Create <span className="text-orange-500">New User</span>
          </h2>
          <p className="text-sm text-slate-500">
            Fill in the details to register a new account.
          </p>
        </div>

        {isModalMode && (
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* IMAGE UPLOAD SECTION */}
      <section
        className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center cursor-pointer transition-colors hover:bg-orange-100/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="size-24 rounded-full bg-white border-2 border-orange-100 overflow-hidden flex items-center justify-center shadow-sm">
          {previewImage ? (
            <img
              src={previewImage}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <p className="mt-3 text-xs font-bold text-orange-600">
          {previewImage ? "Change Avatar" : "Upload Profile Picture"}
        </p>
      </section>

      {/* FORM FIELDS */}
      <div className="space-y-4">
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">Full Name</label>
          <input
            {...register("name")}
            placeholder="Jane Doe"
            className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="jane@example.com"
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* ROLE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">Role *</label>
            <select
              {...register("role")}
              defaultValue=""
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all bg-white"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="Customer">Customer</option>
              <option value="Restaurant Owner">Restaurant Owner</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Password *
            </label>
            <input
              type="password"
              {...register("password")}
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Confirm Password *
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
      >
        {isSubmitting || pending
          ? "Creating Account..."
          : "Create User Account"}
      </button>
    </form>
  );

  if (!isModalMode) {
    return <div className="w-full max-w-2xl mx-auto py-10">{formContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-2xl my-auto animate-in fade-in zoom-in duration-200">
        {formContent}
      </div>
    </div>
  );
}
