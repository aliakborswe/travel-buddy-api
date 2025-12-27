import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { MatchingService } from "./matching.service";

const findMatches = catchAsync(async (req: Request, res: Response) => {
  const { destination, startDate, endDate, interests, travelType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const userId = (req as any).user?.userId;

  const result = await MatchingService.findMatches(
    {
      destination: destination as string,
      startDate: startDate as string,
      endDate: endDate as string,
      interests: interests as string,
      travelType: travelType as string,
      userId,
    },
    page,
    limit
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Matches found successfully",
    data: result.matches,
    meta: result.meta,
  });
});

const getSuggestedMatches = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const matches = await MatchingService.getSuggestedMatches(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggested matches retrieved successfully",
    data: matches,
  });
});

export const MatchingController = {
  findMatches,
  getSuggestedMatches,
};
