import { Request, Response } from "express";

export interface IUserController {
    getAll(req: Request, res: Response): Promise<Response>;
    getById(req: Request, res: Response): Promise<Response>;
    getCurrentUser(req: Request, res: Response): Promise<Response>;
    updateAccountDetails(req: Request, res: Response): Promise<Response>;
    updateAvatar(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}
