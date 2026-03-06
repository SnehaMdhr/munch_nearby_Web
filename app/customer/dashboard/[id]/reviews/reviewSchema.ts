import z from "zod";

export const RawReviewSchema = z.object({
  _id: z.string(),
  customer: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string().optional(),
      imageUrl: z.string().optional(),
    }),
  ]),
  rating: z.union([z.number(), z.string()]),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
});

export type RawReview = z.infer<typeof RawReviewSchema>;
