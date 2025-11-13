// src/interfaces/user.interface.ts

export enum UserRole {
    USER = "user",
    AUTHOR = "author",
    ADMIN = "admin",
}

/**
 * A database-agnostic user model interface.
 * Can be used across MongoDB, PostgreSQL, or any ORM.
 */
export interface IUserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar: string | null;
    bio: string;
    role: UserRole;
    isVerified: boolean;
    socialLinks: ISocialLinks,
    followers: string[];
    following: string[];
    refreshToken: string | null;
    preferences: IUserPreferences
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}

export interface IUserPreferences {
    emailNotifications: boolean;
    marketingUpdates: boolean;
    twoFactorAuth: boolean;
}


export interface ISocialLinks {
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
}

export interface ICreateUser {
    fullName: string;
    email: string;
    username: string;
    password: string;
}

export interface IAuthUser {
    id: string,
    email: string,
    username: string,
    fullName: string,
}

export interface IUpdateUser {
    fullName?: IUserEntity["fullName"];
    email?: IUserEntity["email"];
    username?: IUserEntity["username"];
    bio?: IUserEntity["bio"];
    socialLinks?: IUserEntity["socialLinks"];
}

