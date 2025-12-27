import { RequestHandler } from "express";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createPaymentIntent: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentService.createPaymentIntent(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Payment intent created successfully",
    data: result,
  });
});

const confirmPayment: RequestHandler = catchAsync(async (req, res) => {
  const payment = await PaymentService.confirmPayment(req.body.paymentIntentId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment confirmed successfully",
    data: payment,
  });
});

const getPaymentHistory: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentService.getPaymentHistory(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment history retrieved successfully",
    data: result.payments,
    meta: {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPage: result.pagination.totalPages,
    },
  });
});

const webhookHandler: RequestHandler = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"] as string;

  const result = await PaymentService.webhookHandler(req.body, signature);

  res.json(result);
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  webhookHandler,
};
