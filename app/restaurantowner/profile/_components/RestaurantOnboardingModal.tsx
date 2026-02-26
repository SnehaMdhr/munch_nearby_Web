"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { handleCreateRestaurant } from "@/lib/actions/restaurant-actions";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (restaurant: any) => void;
};

const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  mapLink: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || z.string().url().safeParse(v).success,
      {
        message: "Map link must be a valid URL",
      },
    ),
  contactNumber: z
    .string()
    .min(5, "Contact number must be at least 5 characters"),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= 5 * 1024 * 1024, "Image must be <= 5MB")
    .refine(
      (f) =>
        !f ||
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type),
      "Image must be PNG/JPG/WEBP",
    ),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    })
    .optional(),
});

type RestaurantCreateInput = z.infer<typeof restaurantSchema>;

type FieldErrors = Partial<Record<keyof RestaurantCreateInput, string>>;

function toRestaurantFormData(payload: RestaurantCreateInput): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("address", payload.address);
  formData.append("contactNumber", payload.contactNumber);

  if (payload.mapLink) formData.append("mapLink", payload.mapLink);
  if (payload.category) formData.append("category", payload.category);
  if (payload.description) formData.append("description", payload.description);
  if (payload.location)
    formData.append("location", JSON.stringify(payload.location));
  if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl); // ✅ file

  return formData;
}

export default function RestaurantOnboardingModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<RestaurantCreateInput>({
    name: "",
    address: "",
    mapLink: "",
    contactNumber: "",
    category: "",
    description: "",
    imageUrl: undefined,
    location: undefined,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.address.trim().length >= 5 &&
      form.contactNumber.trim().length >= 5
    );
  }, [form.name, form.address, form.contactNumber]);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setServerError("");
  }, [open]);

  useEffect(() => {
    if (!form.imageUrl) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(form.imageUrl);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.imageUrl]);

  if (!open) return null;

  function update<K extends keyof RestaurantCreateInput>(
    key: K,
    value: RestaurantCreateInput[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setServerError("");
  }

  function normalizePayload(v: RestaurantCreateInput): RestaurantCreateInput {
    const mapLink = v.mapLink?.trim() ? v.mapLink.trim() : undefined;
    const category = v.category?.trim() ? v.category.trim() : undefined;
    const description = v.description?.trim()
      ? v.description.trim()
      : undefined;

    return {
      ...v,
      mapLink,
      category,
      description,
      imageUrl: v.imageUrl,
      location: v.location,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setErrors({});

    const payload = normalizePayload(form);

    const parsed = restaurantSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrs: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RestaurantCreateInput | undefined;
        if (key) fieldErrs[key] = issue.message;
      }
      setErrors(fieldErrs);
      setSubmitting(false);
      return;
    }

    try {
      const formData = toRestaurantFormData(parsed.data);
      const result = await handleCreateRestaurant(formData);

      if (!result?.success) {
        setServerError(result?.message || "Failed to create restaurant.");
        setSubmitting(false);
        return;
      }

      onCreated?.(result?.data?.restaurant ?? result?.data);
      onClose();
    } catch (err: any) {
      setServerError(err?.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-orange-100 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-4 border-b border-orange-100 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">
                Create your{" "}
                <span className="text-orange-500 underline decoration-orange-200">
                  Restaurant
                </span>
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Add details customers need to find you.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full size-9 flex items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-5">
            {/* Image + Basics (design preserved) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 flex flex-col items-center text-center">
                {/* clickable preview circle */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="size-20 rounded-full bg-white border-4 border-orange-200 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-orange-100"
                  aria-label="Choose image"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Restaurant logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-orange-300">🍽️</span>
                  )}
                </button>

                <p className="font-bold mt-3 text-sm">Logo / Cover Image</p>
                <p className="text-xs text-slate-500 mt-1">
                  Pick an image file (PNG/JPG/WEBP, max 5MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    update("imageUrl", file || undefined);
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none hover:bg-orange-50 focus:ring-4 focus:ring-orange-100"
                >
                  {form.imageUrl ? (
                    <span className="truncate block">{form.imageUrl.name}</span>
                  ) : (
                    "Choose file..."
                  )}
                </button>

                {errors.imageUrl && (
                  <p className="text-xs text-red-600 mt-2">{errors.imageUrl}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 content-start">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Restaurant Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="The Golden Taco"
                    className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Food Category
                  </label>
                  <input
                    value={form.category || ""}
                    onChange={(e) => update("category", e.target.value)}
                    placeholder="Mexican Fusion"
                    className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
                  />
                  {errors.category && (
                    <p className="text-xs text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Tell customers what makes you special 🌮🔥"
                rows={3}
                className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description}</p>
              )}
            </section>

            {/* Contact + Map */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Contact Number *
                </label>
                <input
                  value={form.contactNumber}
                  onChange={(e) => update("contactNumber", e.target.value)}
                  placeholder="+977 98xxxxxxx"
                  className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
                />
                {errors.contactNumber && (
                  <p className="text-xs text-red-600">{errors.contactNumber}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Google Maps Link (optional)
                </label>
                <input
                  value={form.mapLink || ""}
                  onChange={(e) => update("mapLink", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
                />
                {errors.mapLink && (
                  <p className="text-xs text-red-600">{errors.mapLink}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">
                  Address *
                </label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="123 Sunny Lane, Foodie City"
                  className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-100"
                />
                {errors.address && (
                  <p className="text-xs text-red-600">{errors.address}</p>
                )}
              </div>
            </section>

            {/* Server error */}
            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Actions */}
            <div className="pt-1 flex flex-col md:flex-row gap-2 justify-end">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="rounded-full px-7 py-3 font-black text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
              >
                {submitting ? "Creating..." : "Create Restaurant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
