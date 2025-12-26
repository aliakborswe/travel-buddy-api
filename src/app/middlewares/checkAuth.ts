import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../helpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (allowedRoles?: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header or cookies
      let accessToken = req.headers.authorization?.replace("Bearer ", "");

      if (!accessToken) {
        accessToken = req.cookies.accessToken;
      }

      if (!accessToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "No token provided");
      }

      // Verify token
      const decoded = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload & {
        userId: string;
        role: string;
      };

      // Check if user exists
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");
      }

      // Check if role is allowed
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          throw new AppError(
            StatusCodes.FORBIDDEN,
            "You are not authorized to access this resource"
          );
        }
      }

      // Attach user to request
      req.user = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
