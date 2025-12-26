import { StatusCodes } from "http-status-codes";
import { User } from "./user.model";
import AppError from "../../helpers/AppError";

const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUser = async (
  userId: string,
  data: Partial<{
    email: string;
    password: string;
    fullName: string;
    profileImage?: string;
    bio?: string;
    travelInterests?: string[];
    visitedCountries?: string[];
    currentLocation?: string;
    role?: "user" | "admin";
    isPremium?: boolean;
    isVerified?: boolean;
    subscriptionEndDate?: Date;
  }>
) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const getAllUsers = async (query: {
  search?: string;
  page?: number | string;
  limit?: number | string;
}) => {
  const { search, page = 1, limit = 10 } = query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const UserService = {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getCurrentUser,
};
