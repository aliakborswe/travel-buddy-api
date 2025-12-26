import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
  }),
});

export const updateUserValidation = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    profileImage: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    travelInterests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
  }),
});
