"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import { menuSchema } from "../schema";
import { handleUpdateMenu } from "@/lib/actions/menu-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const toBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(value);
};

const normalizeIsAvailable = (menu: any) => {
  if (typeof menu?.isAvailable !== "undefined")
    return toBoolean(menu.isAvailable);
  if (typeof menu?.notAvailable !== "undefined")
    return !toBoolean(menu.notAvailable);
  return true;
};

interface UpdateMenuProps {
  menu: any;
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function UpdateMenuForm({
  menu,
  onSuccess,
  isOpen,
  onClose,
}: UpdateMenuProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initial Preview Logic
  const getInitialPreview = () => {
    if (!menu) return null;
    const path = menu.imageUrl || menu.image;
    if (!path) return null;
    return path.startsWith("http") || path.startsWith("data:")
      ? path
      : `${process.env.NEXT_PUBLIC_API_BASE}${path}`;
  };

  const [previewImage, setPreviewImage] = useState<string | null>(
    getInitialPreview(),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu?.name ?? "",
      price: menu?.price ?? 0,
      category: menu?.category ?? "",
      description: menu?.description ?? "",
      isAvailable: normalizeIsAvailable(menu) ? "true" : "false",
    },
  });

  if (!isOpen || !menu) return null;

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
    setError("");
    onClose?.();
  };

  const submit = async (data: any) => {
    startTransition(async () => {
      setError("");
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", String(data.price));
        formData.append("category", data.category);
        formData.append("description", data.description || "");

        const isAvail = toBoolean(data.isAvailable);
        formData.append("isAvailable", String(isAvail));
        formData.append("notAvailable", String(!isAvail));

        if (selectedFile) {
          formData.append("imageUrl", selectedFile);
        }

        const response = await handleUpdateMenu(menu._id, formData);
        if (!response.success) throw new Error(response.message);

        toast.success("Menu updated successfully");
        if (onSuccess) onSuccess();
        handleClose();
      } catch (err: any) {
        setError(err.message || "Update failed");
      }
    });
  };

  const formContent = (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            Update <span className="text-orange-500">Menu Item</span>
          </h2>
          <p className="text-sm text-slate-500">
            Modify the details of your existing dish.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Image Upload Area */}
      <section
        className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="size-24 rounded-full bg-white border-2 border-orange-100 overflow-hidden flex items-center justify-center shadow-inner">
          {previewImage ? (
            <img
              src={previewImage}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <span className="text-3xl">📸</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <p className="mt-2 text-xs font-bold text-orange-600">
          {previewImage ? "Change Photo" : "Upload Photo"}
        </p>
      </section>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">Name *</label>
          <input
            {...register("name")}
            className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">Price *</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.price && (
              <p className="text-xs text-red-500">
                {errors.price.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">
              Category *
            </label>
            <input
              {...register("category")}
              className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all"
            />
            {errors.category && (
              <p className="text-xs text-red-500">
                {errors.category.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm focus:border-orange-400 outline-none transition-all resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500">
              {errors.description.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">
            Availability
          </label>
          <select
            {...register("isAvailable")}
            className="rounded-xl border-2 border-orange-50 px-4 py-2 text-sm outline-none transition-all bg-white"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="flex-1 py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
        >
          {isSubmitting || pending ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-xl my-auto">{formContent}</div>
    </div>
  );
}
