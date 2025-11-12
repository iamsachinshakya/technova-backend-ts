import { Request, Response, NextFunction } from "express";
import { env } from "../../../../app/config/env";
import { verifyToken } from "../../modules/auth/utils/jwt.util";
import { RepositoryProvider } from "../../RepositoryProvider";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

// ✅ Middleware: authenticate user using JWT
export const authenticateJWT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError("Unauthorized request – token missing", 401);
        const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET);

        if (!decoded?.id) throw new ApiError("Invalid or malformed token", 401);

        const user = await RepositoryProvider.userRepository.findById(decoded.id);

        if (!user) throw new ApiError("Invalid or expired access token", 401);

        req.user = user;
        next();
    }
);
