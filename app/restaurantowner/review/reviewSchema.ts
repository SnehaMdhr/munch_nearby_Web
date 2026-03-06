import z from "zod";

export const RawReviewSchema = z.object({
  _id: z.string(),
  rating: z.union([z.number(), z.string()]),
  comment: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  user: z
    .union([
      z.string(),
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    ])
    .optional(),
  customer: z
    .union([
      z.string(),
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    ])
    .optional(),
});

export const ReviewsArraySchema = z.array(RawReviewSchema);
