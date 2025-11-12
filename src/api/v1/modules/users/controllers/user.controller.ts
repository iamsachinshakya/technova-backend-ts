import { Request, Response } from "express";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ServiceProvider } from "../../../ServiceProvider";
import { IUpdateUser } from "../../users/models/user.model.interface";

export class UserController {
  // ✅ Get all users
  async getAll(req: Request, res: Response): Promise<Response> {
    const users = await ServiceProvider.userService.getAllUsers();
    return ApiResponse.success(res, "Users fetched successfully", users);
  }

  // ✅ Get user by ID
  async getById(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.userService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched successfully", user);
  }

  // ✅ Get current logged-in user
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    return ApiResponse.success(res, "User fetched successfully", req.user);
  }

  // ✅ Update account details
  async updateAccountDetails(req: Request, res: Response): Promise<Response> {
    const updates: IUpdateUser = req.body;
    const user = await ServiceProvider.userService.updateAccountDetails(
      req.user!.id,
      updates
    );
    return ApiResponse.success(res, "Account details updated successfully", user);
  }

  // ✅ Update avatar
  async updateAvatar(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.userService.updateAvatar(req.user?.id!, req.file!);
    return ApiResponse.success(res, "Avatar updated successfully", user);
  }

  // ✅ Delete user
  async delete(req: Request, res: Response): Promise<Response> {
    await ServiceProvider.userService.deleteUser(req.params.id);
    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }

}
