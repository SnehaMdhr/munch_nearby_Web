"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { menuSchema } from "../schema";
import { handleUpdateMenu } from "@/lib/actions/menu-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
  if (typeof menu?.isAvailable !== "undefined") {
    return toBoolean(menu.isAvailable);
  }

  if (typeof menu?.notAvailable !== "undefined") {
    return !toBoolean(menu.notAvailable);
  }

  return true;
};

interface UpdateMenuProps {
  menu: any;
  onSuccess?: () => void;
}

export default function UpdateMenuForm({ menu, onSuccess }: UpdateMenuProps) {
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(menu.imageUrl || menu.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu.name ?? "",
      price: menu.price ?? 0,
      category: menu.category ?? "",
      description: menu.description ?? "",
      isAvailable: normalizeIsAvailable(menu) ? "true" : "false",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file
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
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(menu.imageUrl || menu.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", data.name ?? "");
        formData.append("price", String(data.price ?? 0));
        formData.append("category", data.category ?? "");
        formData.append("description", data.description ?? "");
        const isAvailable = toBoolean(data.isAvailable);
        formData.append("isAvailable", isAvailable ? "true" : "false");
        formData.append("notAvailable", isAvailable ? "false" : "true");

        // Append image only if new file selected
        if (selectedFile) {
          formData.append("imageUrl", selectedFile);
        }

        const response = await handleUpdateMenu(menu._id, formData);

        if (!response.success) {
          throw new Error(response.message || "Update failed");
        }

        toast.success("Menu updated successfully");
        if (onSuccess) onSuccess();

      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 space-y-6 max-w-xl"
  >
    <h2 className="text-2xl font-bold text-gray-800">
      Update Menu Item
    </h2>

    {/* NAME */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Name
      </label>
      <input
        {...register("name")}
        className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-4 text-sm outline-none focus:border-[#E87A5D]"
      />
      {errors.name && (
        <p className="text-red-500 text-xs mt-1">
          {errors.name.message as string}
        </p>
      )}
    </div>

    {/* PRICE */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Price
      </label>
      <input
        type="number"
        step="0.01"
        {...register("price")}
        className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-4 text-sm outline-none focus:border-[#E87A5D]"
      />
      {errors.price && (
        <p className="text-red-500 text-xs mt-1">
          {errors.price.message as string}
        </p>
      )}
    </div>

    {/* CATEGORY */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Category
      </label>
      <input
        {...register("category")}
        className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-4 text-sm outline-none focus:border-[#E87A5D]"
      />
      {errors.category && (
        <p className="text-red-500 text-xs mt-1">
          {errors.category.message as string}
        </p>
      )}
    </div>

    {/* IMAGE SECTION */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Menu Image
      </label>

      <div className="bg-[#FFF8F4] p-6 rounded-2xl border border-[#E87A5D]/10 mt-2">
        {preview && (
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border shadow-sm">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>

            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm
            file:mr-4 file:rounded-full file:border-0
            file:bg-[#E87A5D] file:px-5 file:py-2
            file:text-white hover:file:opacity-90 transition"
        />
      </div>
    </div>

    {/* DESCRIPTION */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Description
      </label>
      <textarea
        rows={3}
        {...register("description")}
        className="w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-4 py-3 text-sm outline-none focus:border-[#E87A5D] resize-none"
      />
    </div>

    {/* AVAILABILITY */}
    <div>
      <label className="text-sm font-medium text-gray-600">
        Availability
      </label>
      <select
        {...register("isAvailable")}
        className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-4 text-sm outline-none focus:border-[#E87A5D]"
      >
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>
    </div>

    {/* SUBMIT BUTTON */}
    <button
      type="submit"
      disabled={isSubmitting || pending}
      className="w-full h-10 px-5 rounded-xl text-white text-xs font-semibold transition shadow-sm
                 bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                 hover:opacity-90 disabled:opacity-60"
    >
      {isSubmitting || pending
        ? "Saving Changes..."
        : "Update Menu"}
    </button>
  </form>
);
}