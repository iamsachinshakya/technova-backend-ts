import { Request, Response } from "express";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ServiceProvider } from "../../../ServiceProvider";
import { ISocialLinks, IUpdateUserData, IUserPreferences, UsersQueryParams } from "../../users/models/user.model.interface";

export class UserController {

  async createUser(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.userService.createUser(req.body);
    return ApiResponse.success(res, "User Created successfully", user);
  }


  //  Get all users
  async getAll(req: Request, res: Response): Promise<Response> {
    const query: UsersQueryParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: (req.query.search as string) || "",
      role: (req.query.role as string) || "all",
    };

    const users = await ServiceProvider.userService.getAllUsers(query);

    return ApiResponse.success(res, "Users fetched successfully", users);
  }


  //  Get user by ID
  async getById(req: Request, res: Response): Promise<Response> {
    const user = await ServiceProvider.userService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched successfully", user);
  }

  //  Update account details
  async updateAccountDetails(req: Request, res: Response): Promise<Response> {
    const updates: IUpdateUserData = req.body;
    const user = await ServiceProvider.userService.updateAccountDetails(
      req.params.id,
      updates
    );
    return ApiResponse.success(res, "Account details updated successfully", user);
  }

  //  Update avatar
  async updateAvatar(req: Request, res: Response): Promise<Response> {
    console.log("req.file", req.file);
    console.log("body", req.body)
    const user = await ServiceProvider.userService.updateAvatar(req.params.id, req.file!);
    return ApiResponse.success(res, "Avatar updated successfully", user);
  }

  //  Delete user
  async delete(req: Request, res: Response): Promise<Response> {
    await ServiceProvider.userService.deleteUser(req.params.id);
    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }

  //  Update social links
  async updateSocialLinks(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const links = req.body as ISocialLinks;

    const updatedUser = await ServiceProvider.userService.updateSocialLinks(userId!, links);
    return ApiResponse.success(res, "Social links updated successfully", updatedUser);
  }

  //  Follow a user
  async followUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    await ServiceProvider.userService.followUser(userId!, targetUserId);
    return ApiResponse.success(res, "User followed successfully", null, 200);
  }

  //  Unfollow a user
  async unfollowUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    await ServiceProvider.userService.unfollowUser(userId!, targetUserId);
    return ApiResponse.success(res, "User unfollowed successfully", null, 200);
  }

  //  Get followers
  async getFollowers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const followers = await ServiceProvider.userService.getFollowers(id);
    return ApiResponse.success(res, "Followers fetched successfully", followers);
  }

  //  Get following
  async getFollowing(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const following = await ServiceProvider.userService.getFollowing(id);
    return ApiResponse.success(res, "Following users fetched successfully", following);
  }

  //  Update user preferences
  async updatePreferences(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const preferences = req.body as IUserPreferences;

    const updatedUser = await ServiceProvider.userService.updatePreferences(userId!, preferences);
    return ApiResponse.success(res, "Preferences updated successfully", updatedUser);
  }

  //  Get user preferences
  async getPreferences(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    const preferences = await ServiceProvider.userService.getPreferences(userId!);
    return ApiResponse.success(res, "Preferences fetched successfully", preferences);
  }





}
