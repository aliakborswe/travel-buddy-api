import { z } from "zod";

export const createTravelPlanValidation = z.object({
  body: z.object({
    destination: z.object({
      country: z.string().min(2, "Country is required"),
      city: z.string().min(2, "City is required"),
    }),
    startDate: z.string().datetime().or(z.date()),
    endDate: z.string().datetime().or(z.date()),
    budgetRange: z.object({
      min: z.number().min(0, "Minimum budget must be positive"),
      max: z.number().min(0, "Maximum budget must be positive"),
      currency: z.string().default("USD").optional(),
    }),
    travelType: z.enum(["solo", "family", "friends", "couple"]),
    description: z.string().max(1000).optional(),
    itinerary: z.string().optional(),
    maxTravelers: z.number().min(1).optional(),
    interests: z.array(z.string()).optional(),
  }),
});

export const updateTravelPlanValidation = z.object({
  body: z.object({
    destination: z
      .object({
        country: z.string().min(2),
        city: z.string().min(2),
      })
      .optional(),
    startDate: z.string().datetime().or(z.date()).optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
    budgetRange: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().optional(),
      })
      .optional(),
    travelType: z.enum(["solo", "family", "friends", "couple"]).optional(),
    description: z.string().max(1000).optional(),
    itinerary: z.string().optional(),
    maxTravelers: z.number().min(1).optional(),
    interests: z.array(z.string()).optional(),
    status: z.enum(["planning", "active", "completed", "cancelled"]).optional(),
  }),
});
