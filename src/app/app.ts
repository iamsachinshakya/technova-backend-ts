import express, { NextFunction, Request, Response } from "express";
import { stream } from "./utils/logger";
import morgan from "morgan";
import { env, isDevelopment } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "../api/v1/modules/auth/routes/auth.route";
import { ApiError } from "../api/v1/common/utils/apiError";
import { errorMiddleware } from "../api/v1/common/middlewares/error.middleware";
import { ApiResponse } from "../api/v1/common/utils/apiResponse";
import { userRouter } from "../api/v1/modules/users/routes/user.routes";

const app = express();
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(morgan(isDevelopment ? "dev" : "combined", { stream }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());


// ✅ Health check route — place before main routes
app.get("/", (req: Request, res: Response) => {
    ApiResponse.success(res, "🚀 Express server running!");
});

// ✅ API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// ✅ Catch-all for unmatched routes (Express 5 safe)
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(errorMiddleware);

export default app;
