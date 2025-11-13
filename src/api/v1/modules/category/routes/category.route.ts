import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ControllerProvider } from "../../../ControllerProvider";
import {
    validateBody,
    validateFileSchema,
    validateQuery,
} from "../../../common/middlewares/validate.middleware";
import { uploadSingle } from "../../../common/middlewares/upload.middleware";
import { imageSchema } from "../../users/validations/user.validation";
import {
    createCategorySchema,
    queryCategorySchema,
    updateCategorySchema,
} from "../validations/category.validation";
import { authenticateJWT } from "../../auth/middlewares/auth.middleware";
import { requirePermission } from "../../auth/middlewares/requirePermission";
import { PERMISSIONS } from "../../auth/constants/auth.constant";

export const categoryRouter = Router();
const categoryController = ControllerProvider.categoryController;

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories (with optional filters)
 * @access  Private (Requires category:read permission)
 */
categoryRouter.get(
    "/",
    authenticateJWT,
    requirePermission(PERMISSIONS.CATEGORY.READ),
    validateQuery(queryCategorySchema),
    asyncHandler(categoryController.getAll.bind(categoryController))
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get a category by ID
 * @access  Private (Requires category:read permission)
 */
categoryRouter.get(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.CATEGORY.READ),
    asyncHandler(categoryController.getById.bind(categoryController))
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private (Requires category:create permission)
 */
categoryRouter.post(
    "/",
    authenticateJWT,
    requirePermission(PERMISSIONS.CATEGORY.CREATE),
    uploadSingle("icon"),
    validateFileSchema(imageSchema, { optional: true }),
    validateBody(createCategorySchema),
    asyncHandler(categoryController.create.bind(categoryController))
);

/**
 * @route   PATCH /api/v1/categories/:id
 * @desc    Update category details (icon optional)
 * @access  Private (Requires category:update permission)
 */
categoryRouter.patch(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.CATEGORY.UPDATE),
    uploadSingle("icon"),
    validateFileSchema(imageSchema, { optional: true }),
    validateBody(updateCategorySchema),
    asyncHandler(categoryController.update.bind(categoryController))
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Soft delete category (can pass ?soft=false for hard delete)
 * @access  Private (Requires category:delete permission)
 */
categoryRouter.delete(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.CATEGORY.DELETE),
    asyncHandler(categoryController.delete.bind(categoryController))
);

export default categoryRouter;
