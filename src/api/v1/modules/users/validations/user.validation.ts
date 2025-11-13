import { z } from "zod";

export const registerUserSchema = z.object({
  fullName: z
    .string()
    .nonempty("Full name is required")
    .trim()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be at most 50 characters long"),

  username: z
    .string()
    .nonempty("Username is required")
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    ),

  email: z
    .string()
    .nonempty("Email is required")
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});


export const loginUserSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});

/**
 * Schema: Update User
 * - All fields optional (for partial updates)
 * - Includes nested preferences validation
 */
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be at most 50 characters long")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional(),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
    .optional(),

  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters long")
    .optional(),

  social: z
    .object({
      twitter: z.string().url("Twitter must be a valid URL").optional(),
      linkedin: z.string().url("LinkedIn must be a valid URL").optional(),
      github: z.string().url("GitHub must be a valid URL").optional(),
      website: z.string().url("Website must be a valid URL").optional(),
    })
    .optional(),

  preferences: z
    .object({
      emailNotifications: z.boolean().optional(),
      marketingUpdates: z.boolean().optional(),
      twoFactorAuth: z.boolean().optional(),
    })
    .optional(),
})
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: "At least one field must be provided for update.",
      path: [],
    }
  );

export const imageSchema = z.object({
  file: z
    .any()
    .refine((file: Express.Multer.File | undefined) => !!file, {
      message: "Avatar file is required",
    })
    .refine((file: Express.Multer.File | undefined) => {
      if (!file) return false;
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      return allowedMimeTypes.includes(file.mimetype);
    }, {
      message: "Invalid file type. Allowed types: jpeg, png, webp, gif",
    })
    .refine((file: Express.Multer.File | undefined) => {
      if (!file) return false;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      return file.size <= maxSizeInBytes;
    }, {
      message: "File size must not exceed 5 MB",
    }),
});

export const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});

