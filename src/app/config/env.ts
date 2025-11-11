import dotenv from "dotenv";
import { z } from "zod";
import { Environment, LogLevel } from "./constants";

dotenv.config();

// Define & validate environment schema
const envSchema = z.object({
    NODE_ENV: z.enum(Environment).default(Environment.DEVELOPMENT),
    PORT: z
        .string()
        .regex(/^\d+$/, { message: "PORT must be a number" })
        .default("5000"),

    MONGODB_URI: z.string().url().optional(),
    JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters").optional(),
    LOG_LEVEL: z
        .enum(LogLevel)
        .default(LogLevel.DEBUG),

    // Optional cloud configuration keys
    CLOUDINARY_URL: z.string().optional(),
    REDIS_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment configuration:");
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;

// constants
export const isProduction = env.NODE_ENV === Environment.PRODUCTION;
export const isDevelopment = env.NODE_ENV === Environment.DEVELOPMENT;
export const isTest = env.NODE_ENV === Environment.TEST;

// Log startup configuration summary
console.info(
    `🌍 Environment initialized: ${env.NODE_ENV} | Port: ${env.PORT} | Log level: ${env.LOG_LEVEL}`
);
