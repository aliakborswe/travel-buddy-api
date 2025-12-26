import { RequestHandler } from "express";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User updated successfully",
    data: user,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: result.users,
    meta: {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPage: result.pagination.totalPages,
    },
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data: null,
  });
});

const getCurrentUser: RequestHandler = catchAsync(async (req, res) => {
  const user = await UserService.getCurrentUser(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Current user retrieved successfully",
    data: user,
  });
});

export const UserController = {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getCurrentUser,
};
