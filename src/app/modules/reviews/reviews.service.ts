import { StatusCodes } from "http-status-codes";
import { Review } from "./reviews.model";
import { TravelPlan } from "../travel-plans/travel.model";
import AppError from "../../helpers/AppError";
import { IReview } from "./reviews.interface";

const createReview = async (reviewerId: string, data: Partial<IReview>) => {
  // Check if travel plan exists and is completed
  const travelPlan = await TravelPlan.findById(data.travelPlanId);

  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.status !== "completed") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can only review completed travel plans"
    );
  }

  // Check if reviewer was part of the travel plan
  const wasParticipant =
    travelPlan.userId.toString() === reviewerId ||
    travelPlan.currentTravelers.includes(reviewerId);

  if (!wasParticipant) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only review travel plans you participated in"
    );
  }

  const review = await Review.create({
    ...data,
    reviewerId,
  });

  return await review.populate([
    { path: "reviewerId", select: "fullName profileImage" },
  ]);
};

const getReviewsByUser = async (
  userId: string,
  query: { page?: number | string; limit?: number | string }
) => {
  const { page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({ reviewerId: userId })
    .populate("reviewerId", "fullName profileImage")
    .populate("travelPlanId", "destination startDate endDate")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ reviewerId: userId });

  // Calculate average rating
  const avgRating = await Review.aggregate([
    { $match: { reviewerId: userId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  return {
    reviews,
    averageRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const updateReview = async (
  reviewId: string,
  reviewerId: string,
  data: Partial<IReview>
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, "Review not found");
  }

  if (review.reviewerId.toString() !== reviewerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only update your own reviews"
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true,
  }).populate([{ path: "reviewerId", select: "fullName profileImage" }]);

  return updatedReview;
};

const deleteReview = async (
  reviewId: string,
  reviewerId: string,
  role: string
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, "Review not found");
  }

  // Only owner or admin can delete
  if (review.reviewerId.toString() !== reviewerId && role !== "admin") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to delete this review"
    );
  }

  await Review.findByIdAndDelete(reviewId);

  return review;
};

const getReviewablePlans = async (userId: string) => {
  // Get completed travel plans where user was a participant
  const completedPlans = await TravelPlan.find({
    status: "completed",
    $or: [{ userId: userId }, { currentTravelers: { $in: [userId] } }],
  })
    .populate("userId", "fullName profileImage email")
    .populate("currentTravelers", "fullName profileImage email")
    .sort({ endDate: -1 });

  // For each plan, check which users can be reviewed
  const reviewablePlans = await Promise.all(
    completedPlans.map(async (plan) => {
      // Get all participants (creator + travelers), excluding the current user
      const allParticipants: any[] = [];

      // Add plan creator if they're not the current user and userId is populated
      if (
        plan.userId &&
        typeof plan.userId === "object" &&
        "_id" in plan.userId
      ) {
        const creatorId = (plan.userId as any)._id.toString();
        if (creatorId !== userId) {
          allParticipants.push(plan.userId);
        }
      }

      // Add travelers who are not the current user
      if (plan.currentTravelers && Array.isArray(plan.currentTravelers)) {
        plan.currentTravelers.forEach((traveler: any) => {
          if (traveler && typeof traveler === "object" && "_id" in traveler) {
            const travelerId = traveler._id.toString();
            if (travelerId !== userId) {
              allParticipants.push(traveler);
            }
          }
        });
      }

      // Check which participants haven't been reviewed yet
      const existingReviews = await Review.find({
        travelPlanId: plan._id.toString(),
        reviewerId: userId,
      }).select("reviewerId");

      const reviewedUserIds = existingReviews.map((r) =>
        r.reviewerId.toString()
      );

      const reviewableUsers = allParticipants.filter(
        (participant: any) =>
          participant &&
          participant._id &&
          !reviewedUserIds.includes(participant._id.toString())
      );

      return {
        travelPlan: plan,
        reviewableUsers,
        totalParticipants: allParticipants.length,
        reviewedCount: reviewedUserIds.length,
      };
    })
  );

  // Filter out plans where all users have been reviewed
  return reviewablePlans.filter((plan) => plan.reviewableUsers.length > 0);
};

export const ReviewService = {
  createReview,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewablePlans,
};
