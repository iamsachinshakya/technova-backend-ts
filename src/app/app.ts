import express, { Request, Response } from "express";
import { stream } from "./utils/logger";
import morgan from "morgan";
import { isDevelopment } from "./config/env";

const app = express();

app.use(express.json());
app.use(morgan(isDevelopment ? "dev" : "combined", { stream }));


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World 🌍" });
});

export default app;
