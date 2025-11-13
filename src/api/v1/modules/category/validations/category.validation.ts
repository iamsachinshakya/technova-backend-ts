import { z } from "zod";

/**
 * Zod schema for creating a category
 * - id, postCount, createdAt are generated automatically, so not required
 */
export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100),
    description: z.string().max(500).optional(),
    color: z
        .string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code")
        .optional()
        .default("#6366f1"),
    parentId: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
});

/**
 * Schema: Update Category
 * - All fields optional (for partial updates)
 * - Must include at least one valid field
 */
export const updateCategorySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name must not be empty")
            .max(100, "Name must be less than 100 characters")
            .optional(),

        description: z
            .string()
            .trim()
            .max(500, "Description must be less than 500 characters")
            .optional(),

        color: z
            .string()
            .regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code")
            .optional(),

        parentId: z
            .string()
            .uuid("Parent ID must be a valid UUID")
            .nullable()
            .optional(),

        isActive: z.boolean().optional(),
    })
    .strict() // Reject unknown keys
    .refine(
        (data) =>
            Object.values(data).some(
                (value) =>
                    value !== undefined &&
                    value !== null &&
                    (typeof value !== "string" || value.trim() !== "")
            ),
        {
            message: "At least one field must be provided for update.",
            path: [],
        }
    );



/**
 * Zod schema for query params / category filtering
 * - Rejects unknown keys
 * - All fields optional
 * - If a key exists, it must have a valid value
 */
export const queryCategorySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name cannot be empty")
            .optional(),

        slug: z
            .string()
            .trim()
            .min(1, "Slug cannot be empty")
            .optional(),

        parentId: z
            .string()
            .trim()
            .min(1, "Parent ID cannot be empty")
            .optional(),

        isActive: z
            .union([
                z.literal("true"),
                z.literal("false"),
                z.boolean(),
            ])
            .transform((val) => (val === "true" || val === true))
            .optional(),
    })
    .strict();

