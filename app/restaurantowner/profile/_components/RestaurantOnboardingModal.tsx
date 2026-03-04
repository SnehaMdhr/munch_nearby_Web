"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { handleCreateRestaurant } from "@/lib/actions/restaurant-actions";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (restaurant: any) => void;
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultOpeningHours = DAYS_OF_WEEK.map((day) => ({
  day,
  open: "09:00",
  close: "21:00",
  isClosed: false,
}));

const openingHourItemSchema = z.object({
  day: z.string().min(2),
  open: z.string().min(3),
  close: z.string().min(3),
  isClosed: z.boolean().default(false),
});

type OpeningHourItem = z.infer<typeof openingHourItemSchema>;

const normalizeOpeningHours = (value: unknown): OpeningHourItem[] => {
  let parsedValue = value;

  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return defaultOpeningHours;
    }
  }

  if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
    return defaultOpeningHours;
  }

  return defaultOpeningHours.map((fallback, index) => {
    const byDay = parsedValue.find((item) => item?.day === fallback.day);
    const item = byDay ?? parsedValue[index];

    return {
      day: fallback.day,
      open:
        typeof item?.open === "string" && item.open ? item.open : fallback.open,
      close:
        typeof item?.close === "string" && item.close
          ? item.close
          : fallback.close,
      isClosed:
        typeof item?.isClosed === "boolean" ? item.isClosed : fallback.isClosed,
    };
  });
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

  openingHours: z
    .array(openingHourItemSchema)
    .transform((val) => normalizeOpeningHours(val)),
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
  if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);

  // Important: Convert array to string for multipart/form-data
  formData.append("openingHours", JSON.stringify(payload.openingHours));

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
    openingHours: defaultOpeningHours,
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

  function updateOpeningHour(
    index: number,
    updates: Partial<RestaurantCreateInput["openingHours"][0]>,
  ) {
    const newHours = [...form.openingHours];
    newHours[index] = { ...newHours[index], ...updates };
    update("openingHours", newHours);
  }

  function normalizePayload(v: RestaurantCreateInput): RestaurantCreateInput {
    return {
      ...v,
      mapLink: v.mapLink?.trim() || undefined,
      category: v.category?.trim() || undefined,
      description: v.description?.trim() || undefined,
      openingHours: normalizeOpeningHours(v.openingHours).map((oh) => ({
        day: oh.day.trim(),
        open: oh.open.trim(),
        close: oh.close.trim(),
        isClosed: oh.isClosed,
      })),
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
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof RestaurantCreateInput;
        if (key) fieldErrs[key] = issue.message;
      });
      setErrors(fieldErrs);
      setSubmitting(false);

      return;
    }

    try {
      const formData = toRestaurantFormData(parsed.data);
      const result = await handleCreateRestaurant(formData);

      if (!result?.success) {
        const message = result?.message || "Failed to create restaurant.";
        setServerError(message);
        toast.error(message);
        setSubmitting(false);
        return;
      }
      toast.success("Restaurant created successfully!");

      onCreated?.(result?.data?.restaurant ?? result?.data);
      onClose();
    } catch (err: any) {
      setServerError(err?.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-orange-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Create your{" "}
              <span className="text-orange-500 underline decoration-orange-200">
                Restaurant
              </span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Set up your profile to start receiving orders.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 flex flex-col items-center text-center">
              <div
                className="size-24 rounded-full bg-white border-4 border-orange-100 overflow-hidden flex items-center justify-center shadow-inner cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-4xl">📸</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => update("imageUrl", e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                {form.imageUrl ? "Change Photo" : "Upload Logo"}
              </button>
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-2">{errors.imageUrl}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Restaurant Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all"
                  placeholder="e.g. Kathmandu Kitchen"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Category*
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all"
                  placeholder="e.g. Italian, Bakery, Newari"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm focus:border-orange-400 outline-none transition-all resize-none"
                placeholder="Tell us your story..."
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 rounded-lg text-amber-600 text-xs font-bold">
                SCHEDULING
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Opening Hours
              </h3>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-slate-50/50 p-4 space-y-3">
              {form.openingHours.map((oh, index) => (
                <div
                  key={oh.day}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <span className="col-span-3 text-xs font-bold text-slate-600">
                    {oh.day}
                  </span>

                  <div className="col-span-6 flex items-center gap-2">
                    <input
                      disabled={oh.isClosed}
                      type="time"
                      value={oh.open}
                      onChange={(e) =>
                        updateOpeningHour(index, { open: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-2 py-1.5 text-xs font-medium text-amber-700 accent-amber-500 scheme-light focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 transition-all cursor-pointer"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      disabled={oh.isClosed}
                      type="time"
                      value={oh.close}
                      onChange={(e) =>
                        updateOpeningHour(index, { close: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-2 py-1.5 text-xs text-amber-700 accent-amber-500 scheme-light focus:ring-2 focus:ring-amber-200 outline-none disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                    />
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={oh.isClosed}
                        onChange={(e) =>
                          updateOpeningHour(index, {
                            isClosed: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-amber-500 rounded border-gray-300"
                      />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-amber-600 uppercase transition-colors">
                        Closed
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Phone Number *
              </label>
              <input
                value={form.contactNumber}
                onChange={(e) => update("contactNumber", e.target.value)}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm"
                placeholder="+977 98..."
              />
              {errors.contactNumber && (
                <p className="text-xs text-red-500">{errors.contactNumber}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Google Maps Link*
              </label>
              <input
                required
                value={form.mapLink}
                onChange={(e) => update("mapLink", e.target.value)}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm"
                placeholder="https://goo.gl/maps/..."
              />
              {errors.mapLink && (
                <p className="text-xs text-red-500">{errors.mapLink}</p>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">
                Street Address *
              </label>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="rounded-xl border-2 border-orange-100 px-4 py-2.5 text-sm"
                placeholder="e.g. Lazimpat, Kathmandu"
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>
          </section>

          {serverError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl animate-pulse">
              {serverError}
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-orange-50">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex w-full items-center justify-center
                py-3 px-6 text-white text-sm font-semibold 
                rounded-xl transition shadow-sm
                bg-linear-to-r from-[#E87A5D] to-[#F6B88F]
                hover:opacity-90"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  Saving Details...
                </span>
              ) : (
                "Create Restaurant Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
