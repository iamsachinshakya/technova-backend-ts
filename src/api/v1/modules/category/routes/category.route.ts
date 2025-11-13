import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody, validateFileSchema, validateQuery } from "../../../common/middlewares/validate.middleware";
import { uploadSingle } from "../../../common/middlewares/upload.middleware";
import { imageSchema } from "../../users/validations/user.validation";
import { createCategorySchema, queryCategorySchema, updateCategorySchema } from "../validations/category.validation";

export const categoryRouter = Router();
const categoryController = ControllerProvider.categoryController;

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories (with optional filters)
 * @access  Private (JWT required)
 */
categoryRouter.get(
    "/",
    authenticateJWT,
    validateQuery(queryCategorySchema),
    asyncHandler(categoryController.getAll.bind(categoryController))
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get a category by ID
 * @access  Private
 */
categoryRouter.get(
    "/:id",
    authenticateJWT,
    asyncHandler(categoryController.getById.bind(categoryController))
);

/**
 * @route   POST /api/v1/categories
 * @desc    Update category details or icon (partial update)
 * @access  Private
 */
categoryRouter.post(
    "/",
    authenticateJWT,
    uploadSingle("icon"),
    validateFileSchema(imageSchema, { optional: true }), // validate if present
    validateBody(createCategorySchema),
    asyncHandler(categoryController.create.bind(categoryController))
);

/**
 * @route   PATCH /api/v1/categories/:id
 * @desc    Update category details (icon optional)
 * @access  Private
 */
categoryRouter.patch(
    "/:id",
    authenticateJWT,
    uploadSingle("icon"), // optional field
    validateFileSchema(imageSchema, { optional: true }),
    validateBody(updateCategorySchema),
    asyncHandler(categoryController.update.bind(categoryController))
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Soft delete category (can pass ?soft=false for hard delete)
 * @access  Private
 */
categoryRouter.delete(
    "/:id",
    authenticateJWT,
    asyncHandler(categoryController.delete.bind(categoryController))
);

export default categoryRouter;
