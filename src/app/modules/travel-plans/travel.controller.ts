import { RequestHandler } from "express";
import { TravelPlanService } from "./travel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createTravelPlan: RequestHandler = catchAsync(async (req, res) => {
  const travelPlan = await TravelPlanService.createTravelPlan(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Travel plan created successfully",
    data: travelPlan,
  });
});

const getAllTravelPlans: RequestHandler = catchAsync(async (req, res) => {
  const result = await TravelPlanService.getAllTravelPlans(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Travel plans retrieved successfully",
    data: result.travelPlans,
    meta: {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPage: result.pagination.totalPages,
    },
  });
});

const getTravelPlanById: RequestHandler = catchAsync(async (req, res) => {
  const travelPlan = await TravelPlanService.getTravelPlanById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Travel plan retrieved successfully",
    data: travelPlan,
  });
});

const updateTravelPlan: RequestHandler = catchAsync(async (req, res) => {
  const travelPlan = await TravelPlanService.updateTravelPlan(
    req.params.id,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Travel plan updated successfully",
    data: travelPlan,
  });
});

const deleteTravelPlan: RequestHandler = catchAsync(async (req, res) => {
  await TravelPlanService.deleteTravelPlan(
    req.params.id,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Travel plan deleted successfully",
    data: null,
  });
});

const searchTravelPlans: RequestHandler = catchAsync(async (req, res) => {
  const result = await TravelPlanService.searchTravelPlans(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Travel plans found successfully",
    data: result.travelPlans,
    meta: {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPage: result.pagination.totalPages,
    },
  });
});

const requestToJoin: RequestHandler = catchAsync(async (req, res) => {
  const travelPlan = await TravelPlanService.requestToJoin(
    req.params.id,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Join request sent successfully",
    data: travelPlan,
  });
});

export const TravelPlanController = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan,
  searchTravelPlans,
  requestToJoin,
};
