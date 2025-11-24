// src/modules/auth/interfaces/authService.interface.ts

import { ICreateUser, IUserEntity } from "../../users/models/user.model.interface";

export interface IAuthService {
    registerUser(
        data: ICreateUser
    ): Promise<IUserEntity>;

    generateAccessAndRefreshTokens(
        userId: string
    ): Promise<{ accessToken: string; refreshToken: string }>;

    loginUser(data: {
        email: string;
        password: string;
    }): Promise<{ user: IUserEntity; accessToken: string; refreshToken: string }>;

    logoutUser(userId: string): Promise<IUserEntity | null>;

    refreshAccessToken(
        incomingRefreshToken: string
    ): Promise<{ accessToken: string }>;

    changeUserPassword(data: {
        oldPassword: string;
        newPassword: string;
        userId: string;
    }): Promise<void>;
}
