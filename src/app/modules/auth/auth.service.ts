import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";

interface IRegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface ILoginData {
  email: string;
  password: string;
}

const register = async (data: IRegisterData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "Email already registered");
  }

  // Create new user
  const user = await User.create(data);

  // Generate tokens
  const accessToken = generateToken(
    { userId: user._id, role: user.role },
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    { userId: user._id, role: user.role },
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const login = async (data: ILoginData) => {
  // Find user with password field
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(data.password);

  if (!isPasswordValid) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateToken(
    { userId: user._id, role: user.role },
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    { userId: user._id, role: user.role },
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  // Remove password from response
  const userObject = user.toJSON();

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const { verifyToken } = await import("../../utils/jwt");

  try {
    const decoded = verifyToken(token, envVars.JWT_REFRESH_SECRET) as {
      userId: string;
      role: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    // Generate new access token
    const accessToken = generateToken(
      { userId: user._id, role: user.role },
      envVars.JWT_SECRET,
      envVars.JWT_EXPIRES_IN
    );

    return {
      accessToken,
    };
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
};

export const AuthService = {
  register,
  login,
  refreshToken,
};
