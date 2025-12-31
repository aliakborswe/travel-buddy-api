import { model, Schema } from "mongoose";
import { IReview } from "./reviews.interface";

const reviewSchema = new Schema<IReview>(
  {
    travelPlanId: {
      type: String,
      required: [true, "Travel plan ID is required"],
      ref: "TravelPlan",
    },
    reviewerId: {
      type: String,
      required: [true, "Reviewer ID is required"],
      ref: "User",
    },
    reviewedUserId: {
      type: String,
      required: [true, "Reviewed user ID is required"],
      ref: "User",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ reviewedUserId: 1 });
reviewSchema.index({ travelPlanId: 1 });

// Compound index to prevent duplicate reviews for same reviewer-reviewed user pair in a travel plan
reviewSchema.index(
  { travelPlanId: 1, reviewerId: 1, reviewedUserId: 1 },
  { unique: true }
);

export const Review = model<IReview>("Review", reviewSchema);
