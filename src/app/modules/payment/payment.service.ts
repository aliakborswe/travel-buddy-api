import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import { Payment } from "./payment.model";
import { User } from "../user/user.model";
import AppError from "../../helpers/AppError";
import { envVars } from "../../config/env";
import { IPayment } from "./payment.interface";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const createPaymentIntent = async (userId: string, data: Partial<IPayment>) => {
  const { amount, currency = "USD", subscriptionType } = data;

  if (!amount) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount is required");
  }

  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    metadata: {
      userId,
      subscriptionType: subscriptionType || "",
    },
  });

  // Create payment record
  const payment = await Payment.create({
    userId,
    amount,
    currency,
    subscriptionType,
    stripePaymentIntentId: paymentIntent.id,
    status: "pending",
  });

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
  };
};

const confirmPayment = async (paymentIntentId: string) => {
  // Check if payment already processed
  const existingPayment = await Payment.findOne({
    stripePaymentIntentId: paymentIntentId,
    status: "completed",
  });

  if (existingPayment) {
    // Payment already confirmed, return existing record
    return existingPayment;
  }

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      {
        status: "completed",
        paymentMethod: paymentIntent.payment_method as string,
      },
      { new: true }
    );

    if (payment) {
      // Update user's premium status
      const subscriptionDuration =
        payment.subscriptionType === "yearly" ? 365 : 30;
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setDate(
        subscriptionEndDate.getDate() + subscriptionDuration
      );

      await User.findByIdAndUpdate(payment.userId, {
        isPremium: true,
        isVerified: true,
        subscriptionEndDate,
      });
    }

    return payment;
  }

  throw new AppError(StatusCodes.BAD_REQUEST, "Payment not completed");
};

const getPaymentHistory = async (
  userId: string,
  query: { page?: number | string; limit?: number | string }
) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const skip = (Number(page) - 1) * Number(limit);

  const payments = await Payment.find({ userId })
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Payment.countDocuments({ userId });

  return {
    payments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const webhookHandler = async (body: Buffer | string, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await confirmPayment(paymentIntent.id);
    }

    return { received: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new AppError(StatusCodes.BAD_REQUEST, `Webhook Error: ${message}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  webhookHandler,
};
