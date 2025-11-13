import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodError, ZodTypeAny } from "zod";
import { ApiError } from "../utils/apiError";

/**
 * Middleware to validate plain JSON/body requests using Zod schema
 * @param schema - Zod schema for req.body
 */
export const validateBody = (schema: ZodTypeAny): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message =
          error.issues?.[0]?.message || "Invalid request body";
        return next(new ApiError(message, 400, error.issues));
      }
      next(new ApiError("Invalid request body", 400));
    }
  };
};


/**
 * Middleware to validate query parameters using a Zod schema
 * @param schema - Zod schema for req.query
 */
export const validateQuery = (schema: ZodTypeAny): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query); // validate query params
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message =
          error.issues?.[0]?.message || "Invalid query parameters";
        return next(new ApiError(message, 400, error.issues));
      }
      next(new ApiError("Invalid query parameters", 400));
    }
  };
};

/**
 * Middleware to validate uploaded file(s) and optional body using Zod schema
 * @example
 * const schema = z.object({
 *   body: z.object({ title: z.string().min(3) }),
 *   file: z.object({
 *     originalname: z.string(),
 *     mimetype: z.string(),
 *     buffer: z.instanceof(Buffer)
 *   }),
 * });
 */
export const validateFileSchema = (
  schema: ZodTypeAny,
  options?: { optional?: boolean } // Add this
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        schema.parse({ file: req.file, body: req.body });
      } else if (Array.isArray(req.files)) {
        schema.parse({ files: req.files, body: req.body });
      } else if (options?.optional) {
        // Skip validation if optional and no file
        return next();
      } else {
        throw new ApiError("No file(s) provided", 400);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message =
          error.issues?.[0]?.message || "Invalid file upload data";
        return next(new ApiError(message, 400, error.issues));
      }
      next(error);
    }
  };
};
