import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  travelPlanId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
