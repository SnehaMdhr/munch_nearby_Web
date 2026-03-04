import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const restaurantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  mapLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactNumber: z.string().min(5, "Contact number is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png formats are supported",
    }),
});

export type RestaurantData = z.infer<typeof restaurantSchema>;

export const updateRestaurantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  mapLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactNumber: z.string().min(5, "Contact number is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  openingHours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
      isClosed: z.boolean(),
    }),
  ),
  imageUrl: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPG, JPEG, PNG or WEBP formats are supported",
    }),
});

export type UpdateRestaurantData = z.infer<typeof updateRestaurantSchema>;
