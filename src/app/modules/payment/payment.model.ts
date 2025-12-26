import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    subscriptionType: {
      type: String,
      enum: ["monthly", "yearly"],
      required: [true, "Subscription type is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = model<IPayment>("Payment", paymentSchema);
