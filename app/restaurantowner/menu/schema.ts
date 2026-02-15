import { z } from "zod";

export const menuSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.coerce.number().min(1, "Price is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  isAvailable: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ).optional().default(true),
});

export type MenuData = z.infer<typeof menuSchema>;
export type MenuInput = z.input<typeof menuSchema>;

