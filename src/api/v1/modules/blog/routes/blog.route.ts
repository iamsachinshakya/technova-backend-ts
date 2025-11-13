import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody, validateQuery } from "../../../common/middlewares/validate.middleware";
import {
    createBlogSchema,
    queryBlogSchema,
    scheduleBlogSchema,
    updateBlogSchema,
} from "../validations/blog.validation";
import { authenticateJWT } from "../../auth/middlewares/auth.middleware";
import { requirePermission } from "../../auth/middlewares/requirePermission";
import { PERMISSIONS } from "../../auth/constants/auth.constant";

export const blogRouter = Router();
const blogController = ControllerProvider.blogController;

/**
 * @route   GET /api/v1/blogs
 * @desc    Get all blog posts (with filters)
 * @access  Public
 */
blogRouter.get(
    "/",
    validateQuery(queryBlogSchema),
    asyncHandler(blogController.getAll.bind(blogController))
);

/**
 * @route   GET /api/v1/blogs/:idOrSlug
 * @desc    Get a single blog post by ID or slug
 * @access  Public
 */
blogRouter.get(
    "/:idOrSlug",
    asyncHandler(blogController.getOne.bind(blogController))
);

/**
 * @route   POST /api/v1/blogs
 * @desc    Create a new blog post
 * @access  Private (requires BLOG_CREATE permission)
 */
blogRouter.post(
    "/",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.CREATE),
    validateBody(createBlogSchema),
    asyncHandler(blogController.create.bind(blogController))
);

/**
 * @route   PATCH /api/v1/blogs/:id
 * @desc    Update an existing blog post
 * @access  Private (requires BLOG_EDIT permission)
 */
blogRouter.patch(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.EDIT),
    validateBody(updateBlogSchema),
    asyncHandler(blogController.update.bind(blogController))
);

/**
 * @route   DELETE /api/v1/blogs/:id
 * @desc    Delete a blog post
 * @access  Private (requires BLOG_DELETE permission)
 */
blogRouter.delete(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.DELETE),
    asyncHandler(blogController.delete.bind(blogController))
);

/**
 * @route   PATCH /api/v1/blogs/:id/view
 * @desc    Increment blog post view count
 * @access  Public
 */
blogRouter.patch(
    "/:id/view",
    asyncHandler(blogController.incrementViewCount.bind(blogController))
);

/**
 * @route   POST /api/v1/blogs/:id/like
 * @desc    Like a blog post
 * @access  Private
 */
blogRouter.post(
    "/:id/like",
    authenticateJWT,
    asyncHandler(blogController.addLike.bind(blogController))
);

/**
 * @route   DELETE /api/v1/blogs/:id/like
 * @desc    Remove like from a blog post
 * @access  Private
 */
blogRouter.delete(
    "/:id/like",
    authenticateJWT,
    asyncHandler(blogController.removeLike.bind(blogController))
);

/**
 * @route   POST /api/v1/blogs/:id/schedule
 * @desc    Schedule blog for publishing
 * @access  Private (requires BLOG_EDIT permission)
 */
blogRouter.post(
    "/:id/schedule",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.EDIT),
    validateBody(scheduleBlogSchema),
    asyncHandler(blogController.schedule.bind(blogController))
);

/**
 * @route   PATCH /api/v1/blogs/:id/publish
 * @desc    Publish a blog immediately
 * @access  Private (requires BLOG_EDIT permission)
 */
blogRouter.patch(
    "/:id/publish",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.EDIT),
    asyncHandler(blogController.publish.bind(blogController))
);

/**
 * @route   PATCH /api/v1/blogs/:id/archive
 * @desc    Archive a blog post
 * @access  Private (requires BLOG_EDIT permission)
 */
blogRouter.patch(
    "/:id/archive",
    authenticateJWT,
    requirePermission(PERMISSIONS.BLOG.EDIT),
    asyncHandler(blogController.archive.bind(blogController))
);

export default blogRouter;
