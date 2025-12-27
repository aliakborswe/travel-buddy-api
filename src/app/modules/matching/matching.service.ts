/* eslint-disable @typescript-eslint/no-explicit-any */
import { TravelPlan } from "../travel-plans/travel.model";
import { User } from "../user/user.model";
import AppError from "../../helpers/AppError";
import httpStatus from "http-status-codes";
import { MatchCriteria, MatchResult } from "./matching.interface";



const findMatches = async (criteria: MatchCriteria, page = 1, limit = 10) => {
  const query: any = {
    status: { $in: ["planning", "active"] },
  };

  // Exclude current user's plans if userId provided
  if (criteria.userId) {
    query.userId = { $ne: criteria.userId };
  }

  // Filter by destination
  if (criteria.destination) {
    query.$or = [
      { "destination.country": new RegExp(criteria.destination, "i") },
      { "destination.city": new RegExp(criteria.destination, "i") },
    ];
  }

  // Filter by date range
  if (criteria.startDate || criteria.endDate) {
    query.startDate = {};
    if (criteria.startDate) {
      query.startDate.$gte = new Date(criteria.startDate);
    }
    if (criteria.endDate) {
      query.endDate = { $lte: new Date(criteria.endDate) };
    }
  }

  // Filter by travel type
  if (criteria.travelType) {
    query.travelType = criteria.travelType;
  }

  const skip = (page - 1) * limit;

  const travelPlans = await TravelPlan.find(query)
    .populate("userId", "fullName email profileImage bio travelInterests")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await TravelPlan.countDocuments(query);

  // Calculate match scores if interests provided
  let matches: MatchResult[] = [];

  if (criteria.interests) {
    const userInterests = criteria.interests.split(",").map((i) => i.trim());

    matches = travelPlans.map((plan: any) => {
      const commonInterests = plan.interests.filter((interest: string) =>
        userInterests.some((ui) => ui.toLowerCase() === interest.toLowerCase())
      );

      const matchScore =
        commonInterests.length > 0
          ? (commonInterests.length / userInterests.length) * 100
          : 0;

      return {
        travelPlan: plan,
        user: plan.userId,
        matchScore: Math.round(matchScore),
        commonInterests,
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);
  } else {
    matches = travelPlans.map((plan: any) => ({
      travelPlan: plan,
      user: plan.userId,
      matchScore: 0,
      commonInterests: [],
    }));
  }

  return {
    matches,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getSuggestedMatches = async (userId: string) => {
  // Get user's profile to understand their interests
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get user's upcoming travel plans
  const userPlans = await TravelPlan.find({
    userId,
    status: { $in: ["planning", "active"] },
  });

  // Find matches based on user's interests and destinations
  const allMatches: MatchResult[] = [];

  for (const plan of userPlans) {
    const matches = await findMatches(
      {
        destination: plan.destination.country,
        startDate: plan.startDate.toISOString(),
        endDate: plan.endDate.toISOString(),
        interests: plan.interests.join(","),
        userId,
      },
      1,
      5
    );

    allMatches.push(...matches.matches);
  }

  // If no plans, suggest based on user interests
  if (allMatches.length === 0 && user.travelInterests.length > 0) {
    const matches = await findMatches(
      {
        interests: user.travelInterests.join(","),
        userId,
      },
      1,
      10
    );
    allMatches.push(...matches.matches);
  }

  // Remove duplicates and sort by match score
  const uniqueMatches = allMatches.reduce((acc: MatchResult[], current) => {
    const exists = acc.find(
      (m: any) =>
        m.travelPlan._id.toString() === current.travelPlan._id.toString()
    );
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  uniqueMatches.sort((a, b) => b.matchScore - a.matchScore);

  return uniqueMatches.slice(0, 10);
};

export const MatchingService = {
  findMatches,
  getSuggestedMatches,
};
