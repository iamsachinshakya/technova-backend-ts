import { env } from "../../../../../app/config/env";
import { ApiError } from "../../../common/utils/apiError";
import { RepositoryProvider } from "../../../RepositoryProvider";
import { ICreateUser, IUserEntity } from "../../users/models/user.model.interface";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.util";
import { IAuthService } from "./auth.service.interface";
import { JwtPayload } from "jsonwebtoken";

export class AuthService implements IAuthService {
  // ✅ Register user
  async registerUser(data: ICreateUser): Promise<IUserEntity> {
    const { fullName, email, username, password } = data;

    const existingUser =
      await RepositoryProvider.userRepository.findByEmailOrUsername({
        email,
        username,
      });

    if (existingUser) {
      throw new ApiError("User with this email or username already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new ApiError("Failed to hash password", 500);
    }

    const user = await RepositoryProvider.userRepository.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    return (await RepositoryProvider.userRepository.findById(user.id))!;
  }

  // ✅ Generate tokens
  async generateAccessAndRefreshTokens(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 401);

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    });

    const refreshToken = generateRefreshToken({ id: user.id });
    await RepositoryProvider.userRepository.updateById(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  // ✅ Login user
  async loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: IUserEntity; accessToken: string; refreshToken: string }> {
    if (!email?.trim() || !password?.trim()) {
      throw new ApiError("Email and password are required", 400);
    }

    const user = await RepositoryProvider.userRepository.findByEmail(
      email,
      true // include password for validation
    );

    if (!user) throw new ApiError("User not found", 404);

    if (!user.password) {
      throw new ApiError("User password not found in record", 500);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new ApiError("Invalid credentials", 401);

    const tokens = await this.generateAccessAndRefreshTokens(user.id);
    const updatedUser = await RepositoryProvider.userRepository.findById(user.id);

    if (!updatedUser) throw new ApiError("User not found after login", 404);

    return { user: updatedUser, ...tokens };
  }

  // ✅ Logout user
  async logoutUser(userId: string): Promise<IUserEntity | null> {
    if (!userId) throw new ApiError("User ID is required", 400);
    return await RepositoryProvider.userRepository.removeRefreshTokenById(userId);
  }

  // ✅ Refresh access token
  async refreshAccessToken(
    incomingRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!incomingRefreshToken) {
      throw new ApiError("Unauthorized request", 401);
    }

    const decoded = verifyToken(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decoded || !decoded.id) {
      throw new ApiError("Invalid refresh token payload", 401);
    }

    const user = await RepositoryProvider.userRepository.findById(decoded.id, true);
    if (!user) throw new ApiError("Invalid refresh token", 401);

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError("Refresh token expired or already used", 401);
    }

    return this.generateAccessAndRefreshTokens(user.id);
  }

  // ✅ Change password
  async changeUserPassword({
    oldPassword,
    newPassword,
    userId,
  }: {
    oldPassword: string;
    newPassword: string;
    userId: string;
  }): Promise<void> {
    const user = await RepositoryProvider.userRepository.findById(userId, true);
    if (!user) throw new ApiError("User not found!", 404);

    if (!user.password) {
      throw new ApiError("Password not found in record", 500);
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) throw new ApiError("Invalid credentials", 401);

    const hashedPassword = await hashPassword(newPassword);
    if (!hashedPassword) throw new ApiError("Failed to hash new password", 500);

    await RepositoryProvider.userRepository.updateById(user.id, {
      password: hashedPassword,
    });
  }
}
