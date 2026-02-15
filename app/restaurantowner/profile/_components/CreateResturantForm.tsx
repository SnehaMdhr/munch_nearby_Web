"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleCreateRestaurant } from "@/lib/actions/restaurant-actions";
import { RestaurantData, restaurantSchema } from "../restaurantschema";
import { toast } from "react-toastify";

export default function CreateRestaurantForm() {
 const router = useRouter();
   const [pending, startTransition] = useTransition();
 
   const {
     register,
     handleSubmit,
     control,
     reset,
     formState: { errors, isSubmitting },
   } = useForm<RestaurantData>({
     resolver: zodResolver(restaurantSchema),
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
 
   const onSubmit = async (data: RestaurantData) => {
     setError(null);
 
     startTransition(async () => {
       try {
         const formData = new FormData();
         if (data.name) formData.append("name", data.name);
         if (data.address) formData.append("address", data.address);
         if (data.contactNumber) formData.append("contactNumber", data.contactNumber);
         if (data.mapLink) formData.append("mapLink", data.mapLink);
         if (data.category) formData.append("category", data.category);
         if (data.description) formData.append("description", data.description);
         if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
 
         const response = await handleCreateRestaurant(formData);
 
         if (!response.success) {
           throw new Error(response.message || "Create profile failed");
         }
 
         reset();
         handleDismissImage();
         toast.success("Profile Created successfully 🎉");
 
         // 👉 redirect to users list
         router.push("/restaurantowner/profile");
       } catch (error: Error | any) {
         toast.error(error.message || "Create profile failed");
         setError(error.message || "Create profile failed");
       }
     });
   };
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Name */}
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

      {/* Address */}
      <div>
        <label className="text-sm font-medium">Address</label>
        <input
          {...register("address")}
          placeholder="Enter your address"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.address && (
          <p className="text-xs text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* Contact Number */}
      <div>
        <label className="text-sm font-medium">Contact Number</label>
        <input
          {...register("contactNumber")}
          placeholder="Enter your contact number"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.contactNumber && (
          <p className="text-xs text-red-600">{errors.contactNumber.message}</p>
        )}
      </div>

      {/* Map Link */}
      <div>
        <label className="text-sm font-medium">Map Link</label>
        <input
          {...register("mapLink")}
          placeholder="Enter your map Link"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.mapLink && (
          <p className="text-xs text-red-600">{errors.mapLink.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <input
          {...register("category")}
          placeholder="Enter your category"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.category && (
          <p className="text-xs text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <input
          {...register("description")}
          placeholder="Enter your description"
          className="
            h-11 w-full rounded-lg
            border border-black/10
            bg-[#FFF8F4]
            px-3 text-sm
            outline-none
            focus:border-[#E87A5D]
          "
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
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
          : "Create Restaurant"}
      </button>
    </form>
  );
}
