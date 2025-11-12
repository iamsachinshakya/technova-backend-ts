import { ApiError } from "../../../common/utils/apiError";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.util";
import { RepositoryProvider } from "../../../RepositoryProvider";
import { IUpdateUser, IUserEntity } from "../../users/models/user.model.interface";
import { IUserService } from "./user.service.interface";

export class UserService implements IUserService {
  // ✅ Get all users
  async getAllUsers(): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findAll();
  }

  // ✅ Get user by ID
  async getUserById(userId: string): Promise<IUserEntity> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  // ✅ Update account details
  async updateAccountDetails(
    userId: string,
    body: IUpdateUser
  ): Promise<IUserEntity | null> {
    // Allowed fields for update
    const allowedFields: (keyof IUpdateUser)[] = [
      "fullName",
      "email",
      "username",
      "bio",
      "socialLinks",
    ];

    const updates: Partial<IUpdateUser> = {};

    for (const key of allowedFields) {
      const value = body[key];

      // Trim strings
      if (typeof value === "string" && value.trim() !== "") {
        updates[key] = value.trim() as any;
      }
      // Assign objects or other types directly
      else if (value !== undefined && typeof value === "object") {
        updates[key] = value as any;
      }
    }


    if (Object.keys(updates).length === 0) {
      throw new ApiError("At least one valid field is required to update", 400);
    }

    // Optional: Check if username is taken
    if (updates.username) {
      const existingUser =
        await RepositoryProvider.userRepository.isUsernameTaken(
          updates.username.toLowerCase()
        );
      if (existingUser) throw new ApiError("Username already taken", 409);
    }

    // Update account details in repository
    return await RepositoryProvider.userRepository.updateAccountDetails(
      userId,
      updates
    );
  }


  // ✅ Update avatar
  async updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity> {
    const avatarLocalPath = file?.path;
    if (!avatarLocalPath) throw new ApiError("Avatar file is missing", 400);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) throw new ApiError("Failed to upload avatar", 400);

    const user = await RepositoryProvider.userRepository.updateById(userId, { avatar: avatar.url });

    if (!user) throw new ApiError("User not found", 404);
    return user;
  }


  // ✅ Delete user
  async deleteUser(userId: string): Promise<boolean> {
    const user = await RepositoryProvider.userRepository.deleteById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return true;
  }
}
