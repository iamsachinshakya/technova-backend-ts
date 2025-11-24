import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodError, ZodType } from "zod";
import { ApiError } from "../utils/apiError";
import { ErrorCode } from "../constants.ts/errorCodes";

/**
 * Validate JSON/body using Zod schema
 */
export const validateBody = (schema: ZodType): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Allow file uploads without body
      if ((req.file || req.files) && (!req.body || Object.keys(req.body).length === 0)) {
        return next();
      }

      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues?.[0]?.message || "Invalid request body";
        return next(
          new ApiError(
            message,
            400,
            ErrorCode.VALIDATION_ERROR,
            error.issues
          )
        );
      }

      next(
        new ApiError(
          "Invalid request body",
          400,
          ErrorCode.VALIDATION_ERROR
        )
      );
    }
  };
};

/**
 * Validate Query Parameters
 */
export const validateQuery = (schema: ZodType): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message =
          error.issues?.[0]?.message || "Invalid query parameters";

        return next(
          new ApiError(
            message,
            400,
            ErrorCode.VALIDATION_ERROR,
            error.issues
          )
        );
      }

      next(
        new ApiError(
          "Invalid query parameters",
          400,
          ErrorCode.VALIDATION_ERROR
        )
      );
    }
  };
};

/**
 * Validate File + Body Schema
 */
export const validateFileSchema = (
  schema: ZodType,
  options?: { optional?: boolean }
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        schema.parse({ file: req.file, body: req.body });
      } else if (Array.isArray(req.files)) {
        schema.parse({ files: req.files, body: req.body });
      } else if (options?.optional) {
        return next();
      } else {
        throw new ApiError(
          "No file(s) provided",
          400,
          ErrorCode.VALIDATION_ERROR
        );
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message =
          error.issues?.[0]?.message || "Invalid file upload data";

        return next(
          new ApiError(
            message,
            400,
            ErrorCode.VALIDATION_ERROR,
            error.issues
          )
        );
      }

      next(error);
    }
  };
};
