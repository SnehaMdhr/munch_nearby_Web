"use client";

import { useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { handleUpdateUser } from "@/lib/actions/admin/user-actions";
import { useRouter } from "next/navigation";

interface UpdateUserFormProps {
  user: any;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UpdateUserForm({
  user,
  isOpen,
  onClose,
  onSuccess,
}: UpdateUserFormProps) {
  const isModalMode = typeof isOpen === "boolean";
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<UserData>>({
    resolver: zodResolver(UserSchema.partial()),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
    },
  });

  // Sync form values when the user prop changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? "",
      });
    }
  }, [user, reset]);

  if (isModalMode && !isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    onClose?.();
  };

  const onSubmit = async (data: Partial<UserData>) => {
    startTransition(async () => {
      setError("");
      try {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.role) formData.append("role", data.role);
        if (selectedFile) formData.append("imageUrl", selectedFile);

        const response = await handleUpdateUser(user._id, formData);

        if (!response.success)
          throw new Error(response.message || "Update failed");

        toast.success("Profile updated successfully!");
        handleClose();

        if (onSuccess) {
          onSuccess();
        } else if (!isModalMode) {
          router.push("/admin/users");
        }
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Update failed");
      }
    });
  };

  const formContent = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            Update <span className="text-orange-500">User Profile</span>
          </h2>
          <p className="text-sm text-slate-500">
            Modify details for{" "}
            <span className="font-semibold text-slate-700">
              {user?.name || "this user"}
            </span>
          </p>
        </div>

        {isModalMode && (
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-300 hover:text-slate-600 transition-colors p-1"
          >
            <span className="text-2xl">✕</span>
          </button>
        )}
      </div>

      {/* IMAGE UPLOAD SECTION */}
      <section
        className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center cursor-pointer transition-colors hover:bg-orange-100/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="size-24 rounded-full bg-white border-2 border-orange-100 overflow-hidden flex items-center justify-center shadow-sm relative">
          {previewImage ? (
            <img
              src={previewImage}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : user?.imageUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE}${user.imageUrl}`}
              alt="Profile"
              fill
              className="object-cover"
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
        <p className="mt-3 text-xs font-bold text-orange-600 uppercase tracking-tighter">
          {previewImage || user?.imageUrl ? "Change Photo" : "Upload Photo"}
        </p>
      </section>

      {/* FIELDS */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase font-black text-slate-400 ml-1">
            Full Name
          </label>
          <input
            {...register("name")}
            placeholder="Name"
            className="h-12 rounded-xl border-2 border-orange-50 bg-slate-50/50 px-4 text-sm font-medium focus:border-orange-400 focus:bg-white outline-none transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase font-black text-slate-400 ml-1">
              Email Address
            </label>
            <input
              readOnly
              type="email"
              {...register("email")}
              className="h-12 rounded-xl border-2 border-orange-50 bg-slate-100/80 px-4 text-sm text-slate-500 cursor-not-allowed outline-none transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase font-black text-slate-400 ml-1">
              User Role
            </label>
            <select
              {...register("role")}
              className="h-12 rounded-xl border-2 border-orange-50 bg-slate-50/50 px-4 text-sm font-medium focus:border-orange-400 focus:bg-white outline-none transition-all appearance-none"
            >
              <option value="Customer">Customer</option>
              <option value="Restaurant Owner">Restaurant Owner</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.role.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 h-12 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="flex-1 h-12 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200 uppercase tracking-widest text-[10px]"
        >
          {isSubmitting || pending ? "Updating..." : "Update Account"}
        </button>
      </div>
    </form>
  );

  if (!isModalMode) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 px-4">{formContent}</div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-2xl my-auto animate-in fade-in zoom-in duration-300">
        {formContent}
      </div>
    </div>
  );
}
