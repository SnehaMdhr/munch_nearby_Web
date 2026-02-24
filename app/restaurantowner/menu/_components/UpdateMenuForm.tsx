"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { menuSchema } from "../schema";
import { handleUpdateMenu } from "@/lib/actions/menu-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface UpdateMenuProps {
  menu: any;
}

export default function UpdateMenuForm({ menu }: UpdateMenuProps) {
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(menu.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
      isAvailable: menu.isAvailable ? "true" : "false",
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
    setPreview(menu.imageUrl || null);
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
        formData.append("isAvailable", data.isAvailable === "true" ? "true" : "false");

        // Append image only if new file selected
        if (selectedFile) {
          formData.append("imageUrl", selectedFile);
        }

        const response = await handleUpdateMenu(menu._id, formData);

        if (!response.success) {
          throw new Error(response.message || "Update failed");
        }

        toast.success("Menu updated successfully");
        router.push("/restaurantowner/menu");
        router.refresh();

      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl bg-[#FFF8F4] border border-black/10 rounded-xl p-6 space-y-4 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-800">Update Menu Item</h2>

      {/* --- CURRENT IMAGE --- */}
      {preview && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Image</label>
          <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Menu Image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* --- NEW IMAGE --- */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Change Image</label>
        {preview && (
          <div className="mb-3 flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
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
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
          className="block w-full text-sm"
        />
      </div>

      {/* --- NAME --- */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* PRICE */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
          />
          {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>

        {/* CATEGORY */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <input
            {...register("category")}
            className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
          />
          {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-lg border border-black/10 bg-white p-3 text-sm outline-none focus:border-[#E87A5D]"
        />
      </div>

      {/* STATUS */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Status</label>
        <select
          {...register("isAvailable")}
          className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E87A5D]"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-lg bg-[#E87A5D] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {isSubmitting || pending ? "Saving Changes..." : "Update Menu Item"}
      </button>
    </form>
  );
}