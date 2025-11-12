import { Request, Response } from "express";

export interface IAuthController {
    register(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    refreshAccessToken(req: Request, res: Response): Promise<Response>;
    changePassword(req: Request, res: Response): Promise<Response>;
}
