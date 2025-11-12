import { MongoUserRepository } from "./modules/users/repositories/mongoose/user.repository";
import { IUserRepository } from "./modules/users/repositories/user.repository.interface";

export class RepositoryProvider {
    private static _userRepositoryInstance: MongoUserRepository;

    static get userRepository(): IUserRepository {
        if (!this._userRepositoryInstance)
            this._userRepositoryInstance = new MongoUserRepository();
        return this._userRepositoryInstance;
    }
}
