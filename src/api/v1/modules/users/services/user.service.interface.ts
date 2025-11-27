import { UserPaginatedData } from "../../../common/models/pagination";
import { IUpdateUserData, IUserEntity, IUserPreferences, ISocialLinks, ICreateUserData, UsersQueryParams } from "../../users/models/user.model.interface";

export interface IUserService {
    /**
     * Fetch all users
     */
    getAllUsers(query: UsersQueryParams): Promise<UserPaginatedData>
    /**
     * Get a single user by ID
     */
    getUserById(userId: string): Promise<IUserEntity>;

    /**
     * Update user profile details (name, bio, social links, etc.)
     */
    updateAccountDetails(userId: string, body: IUpdateUserData): Promise<IUserEntity | null>;

    /**
     * Update user avatar/profile image
     */
    updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity>;

    /**
     * Delete user account
     */
    deleteUser(userId: string): Promise<boolean>;

    /**
     * Add or update social links (GitHub, LinkedIn, Twitter, etc.)
     */
    updateSocialLinks(userId: string, links: ISocialLinks): Promise<IUserEntity>;

    /**
     * Follow another user
     */
    followUser(userId: string, targetUserId: string): Promise<void>;

    /**
     * Unfollow another user
     */
    unfollowUser(userId: string, targetUserId: string): Promise<void>;

    /**
     * Get all followers of a user
     */
    getFollowers(userId: string): Promise<IUserEntity[]>;

    /**
     * Get all users the given user is following
     */
    getFollowing(userId: string): Promise<IUserEntity[]>;

    /**
     * Update user preferences (e.g., theme, notifications, reading mode)
     */
    updatePreferences(userId: string, preferences: IUserPreferences): Promise<IUserEntity>;

    /**
     * Get user preferences
     */
    getPreferences(userId: string): Promise<IUserPreferences>;

    createUser(data: ICreateUserData): Promise<IUserEntity | null>
}
