import { Types } from "mongoose";

export interface ITravelPlan {
  _id: Types.ObjectId;
  userId: string;
  destination: {
    country: string;
    city: string;
  };
  startDate: Date;
  endDate: Date;
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  travelType: "solo" | "family" | "friends" | "couple";
  description?: string;
  itinerary?: string;
  maxTravelers?: number;
  currentTravelers: string[];
  interests: string[];
  status: "planning" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
