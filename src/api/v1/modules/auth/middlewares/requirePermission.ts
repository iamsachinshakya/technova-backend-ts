import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../common/utils/apiError";
import { UserRole } from "../../users/models/user.model.interface";
import { RolePermissions } from "../constants/auth.constant";
import { ErrorCode } from "../../../common/constants/errorCodes";

/**
 * Middleware to check if the authenticated user
 * has the required permission.
 * 
 * @param permission The permission string to check (e.g., "blog:create")
 */
export const requirePermission = (permission: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        /** 1. No user (token missing or invalid) */
        if (!user) {
            throw new ApiError(
                "Unauthorized request – token missing",
                401,
                ErrorCode.UNAUTHORIZED
            );
        }

        /** 2. Invalid or missing role */
        const userRole = user.role as UserRole;
        const allowedPermissions = RolePermissions[userRole];

        if (!allowedPermissions) {
            throw new ApiError(
                `Access denied – invalid role: ${userRole}`,
                403,
                ErrorCode.INVALID_ROLE
            );
        }

        /** 3. Role exists but permission is not allowed */
        if (!allowedPermissions.has(permission)) {
            throw new ApiError(
                "Forbidden – insufficient permissions",
                403,
                ErrorCode.PERMISSION_DENIED
            );
        }

        next();
    };
};
