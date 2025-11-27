import { ApiError } from "../../../common/utils/apiError";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.util";
import { RepositoryProvider } from "../../../RepositoryProvider";
import {
  IUpdateUserData,
  IUserEntity,
  IUserPreferences,
  ISocialLinks,
  ICreateUserData,
  UsersQueryParams,
} from "../../users/models/user.model.interface";
import { IUserService } from "./user.service.interface";
import { ErrorCode } from "../../../common/constants/errorCodes";
import { hashPassword } from "../../auth/utils/bcrypt.util";
import { UserPaginatedData } from "../../../common/models/pagination";
import { PAGINATION_PAGE_LIMIT } from "../../../common/constants/constants";

export class UserService implements IUserService {


  async createUser(data: ICreateUserData): Promise<IUserEntity | null> {
    const hashedPassword = await hashPassword(data.password);
    if (!hashedPassword) {
      throw new ApiError(
        "Failed to hash password",
        500,
        ErrorCode.PASSWORD_HASH_FAILED
      );
    }

    return await RepositoryProvider.userRepository.create({
      ...data,
      password: hashedPassword,
    });

  }

  async getAllUsers(query: UsersQueryParams): Promise<UserPaginatedData> {
    const { page = 1, limit = PAGINATION_PAGE_LIMIT, search = "", role = "all" } = query;

    const { data, total } = await RepositoryProvider.userRepository.findAll(
      { search, role },
      { page, limit, sort: { createdAt: -1 } }
    );

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getUserById(userId: string): Promise<IUserEntity> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user;
  }

  async updateAccountDetails(
    userId: string,
    body: IUpdateUserData
  ): Promise<IUserEntity | null> {

    console.log("userdata ->", body);

    const allowedFields: (keyof IUpdateUserData)[] = [
      "fullName",
      "email",
      "username",
      "bio",
      "role",
      "status"
    ];

    const updates: Partial<IUpdateUserData> = {};

    for (const key of allowedFields) {
      const value = body[key];

      if (typeof value === "string" && value.trim() !== "") {
        updates[key] = value.trim() as any;
      } else if (value && typeof value === "object") {
        updates[key] = value as any;
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(
        "At least one valid field is required to update",
        400,
        ErrorCode.BAD_REQUEST
      );
    }

    if (updates.username) {
      const existingUser =
        await RepositoryProvider.userRepository.isUsernameTaken(
          updates.username.toLowerCase()
        );

      if (existingUser) {
        throw new ApiError(
          "Username already taken",
          409,
          ErrorCode.USER_ALREADY_EXISTS
        );
      }
    }

    return await RepositoryProvider.userRepository.updateAccountDetails(
      userId,
      updates
    );
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity> {
    if (!file?.buffer) throw new ApiError("Avatar file is missing", 400, ErrorCode.BAD_REQUEST);

    const avatar = await uploadOnCloudinary(file.buffer, userId, "avatars");
    if (!avatar?.secure_url) throw new ApiError("Failed to upload avatar", 400, ErrorCode.BAD_REQUEST);

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      avatar: avatar.secure_url,
    });
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await RepositoryProvider.userRepository.deleteById(userId);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return true;
  }

  async updateSocialLinks(userId: string, links: ISocialLinks): Promise<IUserEntity> {
    if (!links || Object.keys(links).length === 0) {
      throw new ApiError("At least one social link is required", 400, ErrorCode.BAD_REQUEST);
    }

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      socialLinks: links,
    });

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user;
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {

    if (userId === targetUserId) throw new ApiError("You cannot follow yourself", 400, ErrorCode.BAD_REQUEST);


    const [user, targetUser] = await Promise.all([
      RepositoryProvider.userRepository.findById(userId),
      RepositoryProvider.userRepository.findById(targetUserId),
    ]);

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    if (!targetUser) throw new ApiError("Target user not found", 404, ErrorCode.USER_NOT_FOUND);

    if (targetUser.followers?.some((f) => f.toString() === userId)) {
      throw new ApiError("Already following this user", 409, ErrorCode.BAD_REQUEST);
    }

    await Promise.all([
      RepositoryProvider.userRepository.addFollower(targetUserId, userId),
      RepositoryProvider.userRepository.addFollowing(userId, targetUserId),
    ]);
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {

    if (userId === targetUserId) {
      throw new ApiError("You cannot unfollow yourself", 400, ErrorCode.BAD_REQUEST);
    }

    const [user, targetUser] = await Promise.all([
      RepositoryProvider.userRepository.findById(userId),
      RepositoryProvider.userRepository.findById(targetUserId),
    ]);

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    if (!targetUser) throw new ApiError("Target user not found", 404, ErrorCode.USER_NOT_FOUND);

    await Promise.all([
      RepositoryProvider.userRepository.removeFollower(targetUserId, userId),
      RepositoryProvider.userRepository.removeFollowing(userId, targetUserId),
    ]);
  }

  async getFollowers(userId: string): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findFollowers(userId);
  }

  async getFollowing(userId: string): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findFollowing(userId);
  }

  async updatePreferences(userId: string, preferences: IUserPreferences): Promise<IUserEntity> {

    if (!preferences || Object.keys(preferences).length === 0) {
      throw new ApiError("Preferences object cannot be empty", 400, ErrorCode.BAD_REQUEST);
    }

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      preferences,
    });

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user;
  }

  async getPreferences(userId: string): Promise<IUserPreferences> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user.preferences || {};
  }
}
