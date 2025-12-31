import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  travelPlanId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
