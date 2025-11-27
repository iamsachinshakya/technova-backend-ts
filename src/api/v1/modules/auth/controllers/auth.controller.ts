import { Request, Response } from "express";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ServiceProvider } from "../../../ServiceProvider";
import { secureCookieOptions } from "../utils/auth.util";
import { IAuthController } from "./auth.controller.interface";
import { ApiError } from "../../../common/utils/apiError";
import { ErrorCode } from "../../../common/constants/errorCodes";

export class AuthController implements IAuthController {

  /* ---------------------------------------------------------
     REGISTER
  ----------------------------------------------------------*/
  async register(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.authService.registerUser(req.body);

    return ApiResponse.success(res, "User registered successfully", user, 201);
  }

  /* ---------------------------------------------------------
     GET CURRENT USER
  ----------------------------------------------------------*/
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    const userId = req?.user?.id;

    if (!userId)
      throw new ApiError(
        "Unauthorized user",
        401,
        ErrorCode.UNAUTHORIZED,
      );

    const user = await ServiceProvider.userService.getUserById(userId);

    if (!user)
      throw new ApiError(
        "User not found",
        404,
        ErrorCode.USER_NOT_FOUND,
      );

    return ApiResponse.success(res, "User fetched successfully", user);
  }

  /* ---------------------------------------------------------
     LOGIN
  ----------------------------------------------------------*/
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

  /* ---------------------------------------------------------
     LOGOUT
  ----------------------------------------------------------*/
  async logout(req: Request, res: Response): Promise<Response> {
    if (!req?.user?.id)
      throw new ApiError(
        "User ID missing from request",
        400,
        ErrorCode.BAD_REQUEST,
      );

    await ServiceProvider.authService.logoutUser(req.user.id);

    res
      .clearCookie("accessToken", secureCookieOptions)
      .clearCookie("refreshToken", secureCookieOptions);

    return ApiResponse.success(res, "User logged out successfully");
  }

  /* ---------------------------------------------------------
     REFRESH ACCESS TOKEN
  ----------------------------------------------------------*/
  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        "Refresh token missing",
        401,
        ErrorCode.REFRESH_TOKEN_MISSING,
      );
    }

    const { accessToken } =
      await ServiceProvider.authService.refreshAccessToken(
        incomingRefreshToken
      );

    res
      .cookie("accessToken", accessToken, secureCookieOptions)

    return ApiResponse.success(res, "Access token refreshed successfully", {
      accessToken,
    });
  }

  /* ---------------------------------------------------------
     CHANGE PASSWORD
  ----------------------------------------------------------*/
  async changePassword(req: Request, res: Response): Promise<Response> {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id

    if (!userId)
      throw new ApiError(
        "User not found in request",
        401,
        ErrorCode.UNAUTHORIZED,
      );


    await ServiceProvider.authService.changeUserPassword({ oldPassword, newPassword }, userId);

    return ApiResponse.success(res, "Password changed successfully");
  }
}
