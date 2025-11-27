import { SortOrder } from "mongoose";
import { IRegisterData, IUpdateUserData, IUserEntity } from "../models/user.model.interface";

export interface IUserRepository {
    create(data: IRegisterData): Promise<IUserEntity>;
    findById(id: string, isRequiredSensitiveData?: boolean): Promise<IUserEntity | null>;
    findByEmail(email: string, isRequiredSensitiveData?: boolean): Promise<IUserEntity | null>;
    findByUsername(username: string): Promise<IUserEntity | null>;
    findByEmailOrUsername(params: { email?: string; username?: string }): Promise<IUserEntity | null>;
    /**
      * Get all users with optional search, role filter, pagination, and sorting
      * @param filter - Optional search and role filter
      * @param options - Pagination and sorting options
      * @returns Paginated data and total count
      */
    findAll(
        filter: { search?: string; role?: string },
        options: { page?: number; limit?: number; sort?: Record<string, SortOrder> }
    ): Promise<{ data: IUserEntity[]; total: number }>

    updateById(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null>;
    deleteById(id: string): Promise<IUserEntity | null>;
    removeRefreshTokenById(userId: string): Promise<IUserEntity | null>;
    updateAccountDetails(userId: string, updates: Partial<IUpdateUserData>): Promise<IUserEntity | null>;
    isUsernameTaken(username: string): Promise<boolean>;
    aggregate?(pipeline: any[]): Promise<any[]>; // optional for MongoDB

    addFollower(targetUserId: string, followerId: string): Promise<void>;
    removeFollower(targetUserId: string, followerId: string): Promise<void>;

    addFollowing(userId: string, targetUserId: string): Promise<void>;
    removeFollowing(userId: string, targetUserId: string): Promise<void>;

    findFollowers(userId: string): Promise<IUserEntity[]>;
    findFollowing(userId: string): Promise<IUserEntity[]>;
}
