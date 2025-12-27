import { RequestHandler } from "express";
import { ReviewService } from "./reviews.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createReview: RequestHandler = catchAsync(async (req, res) => {
  const review = await ReviewService.createReview(req.user.userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Review created successfully",
    data: review,
  });
});

const getReviewsByUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewService.getReviewsByUser(
    req.params.userId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reviews retrieved successfully",
    data: {
      reviews: result.reviews,
      averageRating: result.averageRating,
    },
    meta: {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPage: result.pagination.totalPages,
    },
  });
});

const updateReview: RequestHandler = catchAsync(async (req, res) => {
  const review = await ReviewService.updateReview(
    req.params.id,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Review updated successfully",
    data: review,
  });
});

const deleteReview: RequestHandler = catchAsync(async (req, res) => {
  await ReviewService.deleteReview(
    req.params.id,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

const getReviewablePlans: RequestHandler = catchAsync(async (req, res) => {
  const reviewablePlans = await ReviewService.getReviewablePlans(
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reviewable plans retrieved successfully",
    data: reviewablePlans,
  });
});

export const ReviewController = {
  createReview,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewablePlans,
};
