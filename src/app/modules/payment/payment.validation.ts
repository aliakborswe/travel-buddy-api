import { z } from "zod";

export const createPaymentValidation = z.object({
  body: z.object({
    subscriptionType: z.enum(["monthly", "yearly"]),
    amount: z.number().min(0, "Amount must be positive"),
    currency: z.string().default("USD").optional(),
  }),
});
