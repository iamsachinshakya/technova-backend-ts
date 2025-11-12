import { ICreateUser, IUpdateUser, IUserEntity } from "../models/user.model.interface";

export interface IUserRepository {
    create(data: ICreateUser): Promise<IUserEntity>;
    findById(id: string, isPasswordRequired?: boolean): Promise<IUserEntity | null>;
    findByEmail(email: string, isPasswordRequired?: boolean): Promise<IUserEntity | null>;
    findByUsername(username: string): Promise<IUserEntity | null>;
    findByEmailOrUsername(params: { email?: string; username?: string }): Promise<IUserEntity | null>;
    findAll(sort?: Record<string, 1 | -1>): Promise<IUserEntity[]>;
    updateById(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null>;
    deleteById(id: string): Promise<IUserEntity | null>;
    removeRefreshTokenById(userId: string): Promise<IUserEntity | null>;
    updateAccountDetails(userId: string, updates: Partial<IUpdateUser>): Promise<IUserEntity | null>;
    isUsernameTaken(username: string): Promise<boolean>;
    aggregate?(pipeline: any[]): Promise<any[]>; // optional for MongoDB
}
