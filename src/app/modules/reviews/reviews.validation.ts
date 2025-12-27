import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    travelPlanId: z.string().min(1, "Travel plan ID is required"),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not exceed 5"),
    comment: z.string().max(1000).optional(),
  }),
});

export const updateReviewValidation = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }),
});
