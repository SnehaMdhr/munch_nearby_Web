"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { menuSchema } from "../schema";
import { handleCreateMenu } from "@/lib/actions/menu-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function CreateMenuForm() {
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
    } = useForm({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            isAvailable: "true",
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
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const submit = async (data: any) => {
        startTransition(async () => {
            setError("");
            try {
                // Create FormData for file upload
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("price", data.price.toString());
                formData.append("category", data.category);
                formData.append("description", data.description || "");
                formData.append("isAvailable", data.isAvailable === "true" ? "true" : "false");

                if (selectedFile) {
                    formData.append("imageUrl", selectedFile);
                }

                const response = await handleCreateMenu(formData);

                if (!response.success) {
                    throw new Error(response.message);
                }

                toast.success("Menu Created successfully.");
                router.push("/restaurantowner/menu");

            } catch (err: any) {
                const msg = err.message || "Menu Creation failed";
                setError(msg);
                toast.error(msg);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

            {/* Name */}
            <div>
                <label>Name</label>
                <input type="text" {...register("name")} />
                {errors.name && <p>{errors.name.message}</p>}
            </div>

            {/* Price */}
            <div>
                <label>Price</label>
                <input type="number" step="0.01" {...register("price")} />
                {errors.price && <p>{errors.price.message}</p>}
            </div>

            {/* Category */}
            <div>
                <label>Category</label>
                <input type="text" {...register("category")} />
                {errors.category && <p>{errors.category.message}</p>}
            </div>

            {/* 🔥 Image Upload */}
            <div>
                <label>Menu Image</label>
                {previewImage && (
                    <div className="mb-3 flex items-center gap-3">
                        <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
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
                    className="block w-full"
                />
            </div>

            {/* Description */}
            <div>
                <label>Description</label>
                <textarea {...register("description")} />
            </div>

            {/* Availability */}
            <div>
                <label>Availability</label>
                <select {...register("isAvailable")}>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>

            <button type="submit" disabled={isSubmitting || pending}>
                {isSubmitting || pending ? "Creating..." : "Create Menu"}
            </button>
        </form>
    );
}