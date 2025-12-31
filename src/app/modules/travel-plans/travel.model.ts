import { model, Schema } from "mongoose";
import { ITravelPlan } from "./travel.interface";

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    destination: {
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    budgetRange: {
      min: {
        type: Number,
        required: [true, "Minimum budget is required"],
        min: 0,
      },
      max: {
        type: Number,
        required: [true, "Maximum budget is required"],
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    travelType: {
      type: String,
      enum: ["solo", "family", "friends", "couple"],
      required: [true, "Travel type is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    itinerary: {
      type: String,
      trim: true,
    },
    maxTravelers: {
      type: Number,
      default: 10,
    },
    currentTravelers: {
      type: [String],
      default: [],
    },
    joinedUser: {
      type: [String],
      default: [],
      ref: "User",
    },
    interests: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient searching
travelPlanSchema.index({ "destination.country": 1, "destination.city": 1 });
travelPlanSchema.index({ startDate: 1, endDate: 1 });
travelPlanSchema.index({ userId: 1 });
travelPlanSchema.index({ status: 1 });

export const TravelPlan = model<ITravelPlan>("TravelPlan", travelPlanSchema);
