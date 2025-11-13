import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody, validateFileSchema } from "../../../common/middlewares/validate.middleware";
import { uploadSingle } from "../../../common/middlewares/upload.middleware";
import { imageSchema, updateUserSchema } from "../validations/user.validation";
import { authenticateJWT } from "../../auth/middlewares/auth.middleware";
import { requirePermission } from "../../auth/middlewares/requirePermission";
import { PERMISSIONS } from "../../auth/constants/auth.constant";

export const userRouter = Router();
const userController = ControllerProvider.userController;

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
userRouter.get(
  "/",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getAll.bind(userController))
);

/**
 * @route   GET /api/v1/users/current-user
 * @desc    Get details of the logged-in user
 * @access  Private
 */
userRouter.get(
  "/current-user",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getCurrentUser.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/update-account
 * @desc    Update user profile details (name, email, etc.)
 * @access  Private (User must have update permission)
 */
userRouter.patch(
  "/update-account",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  validateBody(updateUserSchema),
  asyncHandler(userController.updateAccountDetails.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/avatar
 * @desc    Update user avatar (optional upload)
 * @access  Private (User must have update permission)
 */
userRouter.patch(
  "/avatar",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  uploadSingle("avatar"),
  validateFileSchema(imageSchema, { optional: true }),
  asyncHandler(userController.updateAvatar.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin or same user)
 */
userRouter.get(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getById.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user (soft delete or permanent based on logic)
 * @access  Private (Admin only)
 */
userRouter.delete(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.DELETE),
  asyncHandler(userController.delete.bind(userController))
);

export default userRouter;
