import { Types } from "mongoose";

export interface IPayment {
  _id: Types.ObjectId;
  userId: string;
  amount: number;
  currency: string;
  subscriptionType: "monthly" | "yearly";
  status: "pending" | "completed" | "failed" | "refunded";
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
