import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  travelInterests: string[];
  visitedCountries: string[];
  currentLocation?: string;
  role: "user" | "admin";
  isPremium: boolean;
  isVerified: boolean;
  subscriptionEndDate?: Date;
  completedTripsCount: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
