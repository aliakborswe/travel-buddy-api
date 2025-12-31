import { StatusCodes } from "http-status-codes";
import { TravelPlan } from "./travel.model";
import AppError from "../../helpers/AppError";
import { ITravelPlan } from "./travel.interface";
import { User } from "../user/user.model";

const createTravelPlan = async (userId: string, data: Partial<ITravelPlan>) => {
  const travelPlan = await TravelPlan.create({
    ...data,
    userId,
  });

  return travelPlan;
};

const getAllTravelPlans = async (query: {
  page?: number | string;
  limit?: number | string;
  status?: string;
  userId?: string;
  joinedUserId?: string;
}) => {
  const { page = 1, limit = 10, status, userId, joinedUserId } = query;

  const filter: Record<string, unknown> = {};

  if (status) {
    // Handle comma-separated status values like "planning,active"
    const statuses = status.split(",").map((s) => s.trim());
    if (statuses.length > 1) {
      filter.status = { $in: statuses };
    } else {
      filter.status = status;
    }
  }

  if (userId && joinedUserId) {
    // Fetch plans where user is either owner or joined
    filter.$or = [{ userId: userId }, { joinedUser: joinedUserId }];
  } else if (userId) {
    filter.userId = userId;
  } else if (joinedUserId) {
    filter.joinedUser = joinedUserId;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const travelPlans = await TravelPlan.find(filter)
    .populate("userId", "fullName profileImage email")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  // Ensure interests field exists for backward compatibility
  travelPlans.forEach((plan) => {
    if (!plan.interests) {
      plan.interests = [];
    }
  });

  const total = await TravelPlan.countDocuments(filter);

  return {
    travelPlans,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getTravelPlanById = async (id: string) => {
  const travelPlan = await TravelPlan.findById(id).populate(
    "userId",
    "fullName profileImage email bio travelInterests currentLocation isPremium"
  );

  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Ensure interests field is always an array for backward compatibility
  if (!travelPlan.interests) {
    travelPlan.interests = [];
  }

  return travelPlan;
};

const updateTravelPlan = async (
  id: string,
  userId: string,
  data: Partial<ITravelPlan>
) => {
  const travelPlan = await TravelPlan.findById(id);

  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.userId.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to update this travel plan"
    );
  }

  const updatedTravelPlan = await TravelPlan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedTravelPlan;
};

const deleteTravelPlan = async (id: string, userId: string, role: string) => {
  const travelPlan = await TravelPlan.findById(id);

  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  // Only owner or admin can delete
  if (travelPlan.userId.toString() !== userId && role !== "admin") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to delete this travel plan"
    );
  }

  await TravelPlan.findByIdAndDelete(id);

  return travelPlan;
};

const searchTravelPlans = async (query: {
  destination?: string;
  startDate?: string;
  endDate?: string;
  travelType?: string;
  interests?: string | string[];
  page?: number | string;
  limit?: number | string;
}) => {
  const {
    destination,
    startDate,
    endDate,
    travelType,
    interests,
    page = 1,
    limit = 10,
  } = query;

  const filter: Record<string, unknown> = {
    status: { $in: ["planning", "active"] },
  };

  if (destination) {
    filter.$or = [
      { "destination.country": { $regex: destination, $options: "i" } },
      { "destination.city": { $regex: destination, $options: "i" } },
    ];
  }

  if (startDate && endDate) {
    filter.$and = [
      { startDate: { $gte: new Date(startDate) } },
      { endDate: { $lte: new Date(endDate) } },
    ];
  }

  if (travelType) {
    filter.travelType = travelType;
  }

  if (interests) {
    const interestArray = Array.isArray(interests) ? interests : [interests];
    filter.interests = { $in: interestArray };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const travelPlans = await TravelPlan.find(filter)
    .populate("userId", "fullName profileImage email")
    .skip(skip)
    .limit(Number(limit))
    .sort({ startDate: 1 });

  // Ensure interests field exists for backward compatibility
  travelPlans.forEach((plan) => {
    if (!plan.interests) {
      plan.interests = [];
    }
  });

  const total = await TravelPlan.countDocuments(filter);

  return {
    travelPlans,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const requestToJoin = async (planId: string, userId: string) => {
  const travelPlan = await TravelPlan.findById(planId);

  if (!travelPlan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.userId.toString() === userId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You cannot join your own travel plan"
    );
  }

  if (travelPlan.currentTravelers.includes(userId)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You have already joined this travel plan"
    );
  }

  if (
    travelPlan.maxTravelers &&
    travelPlan.currentTravelers.length >= travelPlan.maxTravelers
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Travel plan is full");
  }

  travelPlan.currentTravelers.push(userId);

  // Add user to joinedUser array if not already present
  if (!travelPlan.joinedUser.includes(userId)) {
    travelPlan.joinedUser.push(userId);
  }

  await travelPlan.save();

  return travelPlan;
};

const updateTravelStatuses = async () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  try {
    // Find plans that will be marked as completed
    const plansToComplete = await TravelPlan.find({
      endDate: { $lt: currentDate },
      status: { $in: ["planning", "active"] },
    });

    // Update plans to "completed" if end date has passed
    const completedPlans = await TravelPlan.updateMany(
      {
        endDate: { $lt: currentDate },
        status: { $in: ["planning", "active"] },
      },
      {
        $set: { status: "completed" },
      }
    );

    // Increment completedTripsCount for all joined users in completed plans
    if (plansToComplete.length > 0) {
      for (const plan of plansToComplete) {
        if (plan.joinedUser && plan.joinedUser.length > 0) {
          await User.updateMany(
            { _id: { $in: plan.joinedUser } },
            { $inc: { completedTripsCount: 1 } }
          );
        }
      }
    }

    // Update plans to "active" if we're between start and end date
    const activatedPlans = await TravelPlan.updateMany(
      {
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
        status: "planning",
      },
      {
        $set: { status: "active" },
      }
    );

    console.log(
      `Travel status update: ${activatedPlans.modifiedCount} plans activated, ${completedPlans.modifiedCount} plans completed`
    );

    return {
      activatedCount: activatedPlans.modifiedCount,
      completedCount: completedPlans.modifiedCount,
    };
  } catch (error) {
    console.error("Error updating travel statuses:", error);
    throw error;
  }
};

export const TravelPlanService = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan,
  searchTravelPlans,
  requestToJoin,
  updateTravelStatuses,
};
