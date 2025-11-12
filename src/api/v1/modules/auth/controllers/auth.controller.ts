import { Request, Response } from "express";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ServiceProvider } from "../../../ServiceProvider";
import { secureCookieOptions } from "../utils/auth.util";
import { IAuthController } from "./auth.controller.interface";
import { ApiError } from "../../../common/utils/apiError";

export class AuthController implements IAuthController {
  // ✅ Register user
  async register(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.authService.registerUser(req.body);
    return ApiResponse.success(res, "User registered successfully", user, 201);
  }

  // ✅ Login user
  async login(req: Request, res: Response): Promise<Response> {
    const { user, accessToken, refreshToken } =
      await ServiceProvider.authService.loginUser(req.body);

    res
      .cookie("accessToken", accessToken, secureCookieOptions)
      .cookie("refreshToken", refreshToken, secureCookieOptions);

    return ApiResponse.success(res, "User logged in successfully", {
      user,
      accessToken,
      refreshToken,
    });
  }

  // ✅ Logout user
  async logout(req: Request, res: Response): Promise<Response> {
    if (!req?.user?.id)
      throw new ApiError("User ID missing from request", 400);

    await ServiceProvider.authService.logoutUser(req.user.id);

    res
      .clearCookie("accessToken", secureCookieOptions)
      .clearCookie("refreshToken", secureCookieOptions);

    return ApiResponse.success(res, "User logged out successfully");
  }

  // ✅ Refresh access token
  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError("Unauthorized request", 401);
    }

    const { accessToken, refreshToken } =
      await ServiceProvider.authService.refreshAccessToken(
        incomingRefreshToken
      );

    res
      .cookie("accessToken", accessToken, secureCookieOptions)
      .cookie("refreshToken", refreshToken, secureCookieOptions);

    return ApiResponse.success(res, "Access token refreshed successfully", {
      accessToken,
      refreshToken,
    });
  }

  // ✅ Change password
  async changePassword(req: Request, res: Response): Promise<Response> {
    const { oldPassword, newPassword } = req.body;

    if (!req.user?.id)
      throw new ApiError("User not found in request", 401);

    await ServiceProvider.authService.changeUserPassword({
      oldPassword,
      newPassword,
      userId: req.user.id,
    });

    return ApiResponse.success(res, "Password changed successfully");
  }
}
