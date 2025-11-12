import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody, validateFileSchema } from "../../../common/middlewares/validate.middleware";
import { updateAvatarSchema, updateUserSchema } from "../validations/user.validation";
import { uploadSingle } from "../../../common/middlewares/upload.middleware";

export const userRouter = Router();

const userController = ControllerProvider.userController;

// Get all users
userRouter.get(
  "/",
  authenticateJWT,
  asyncHandler(userController.getAll.bind(userController))
);

// Get logged-in user
userRouter.get(
  "/current-user",
  authenticateJWT,
  asyncHandler(userController.getCurrentUser.bind(userController))
);

// Update account details
userRouter.patch(
  "/update-account",
  authenticateJWT,
  validateBody(updateUserSchema),
  asyncHandler(userController.updateAccountDetails.bind(userController))
);

// Update avatar
userRouter.patch(
  "/avatar",
  authenticateJWT,
  uploadSingle("avatar"),
  validateFileSchema(updateAvatarSchema),
  asyncHandler(userController.updateAvatar.bind(userController))
);

// Get user by ID / Delete user
userRouter
  .route("/:id")
  .get(
    authenticateJWT,
    asyncHandler(userController.getById.bind(userController))
  )
  .delete(
    authenticateJWT,
    asyncHandler(userController.delete.bind(userController))
  );
