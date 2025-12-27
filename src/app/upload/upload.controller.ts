import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import AppError from "../helpers/AppError";
import { sendResponse } from "../utils/sendResponse";

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  const imageUrl = req.file.path;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully",
    data: {
      url: imageUrl,
    },
  });
});
