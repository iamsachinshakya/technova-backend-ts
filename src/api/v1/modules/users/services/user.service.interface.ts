import { IUpdateUser, IUserEntity } from "../../users/models/user.model.interface";

export interface IUserService {
    getAllUsers(): Promise<IUserEntity[]>;

    getUserById(userId: string): Promise<IUserEntity>;

    updateAccountDetails(
        userId: string,
        body: IUpdateUser
    ): Promise<IUserEntity | null>;

    updateAvatar(
        userId: string,
        file: Express.Multer.File
    ): Promise<IUserEntity>;

    deleteUser(userId: string): Promise<boolean>;

}
