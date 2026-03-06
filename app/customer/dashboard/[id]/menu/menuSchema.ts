import z from "zod";

export const MenuSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean(),
});

export type MenuType = z.infer<typeof MenuSchema>;
