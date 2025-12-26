import { RequestHandler } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { setCookie } from "../../utils/setCookie";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const register: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  // Set tokens in cookies
  setCookie(res, "accessToken", result.accessToken);
  setCookie(res, "refreshToken", result.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  // Set tokens in cookies
  setCookie(res, "accessToken", result.accessToken);
  setCookie(res, "refreshToken", result.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  setCookie(res, "accessToken", result.accessToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Token refreshed successfully",
    data: result,
  });
});

const logout: RequestHandler = catchAsync(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Logout successful",
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
};
