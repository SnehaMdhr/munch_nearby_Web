import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const menuSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.coerce.number().min(1, "Price is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  isAvailable: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ).optional().default(true),
  imageUrl: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      return file.size <= MAX_FILE_SIZE;
    }, {
      message: "Max file size is 5MB",
    })
    .refine((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return true; // Allow if validation already passed
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, {
      message: "Only JPG, JPEG, PNG or WEBP formats are supported",
    }),
});

export type MenuData = z.infer<typeof menuSchema>;
export type MenuInput = z.input<typeof menuSchema>;

export const MenuUpdateSchema = menuSchema.partial();
export type MenuUpdateData = z.infer<typeof MenuUpdateSchema>;
export type MenuUpdateInput = z.input<typeof MenuUpdateSchema>;