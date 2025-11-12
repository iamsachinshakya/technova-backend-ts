import { AuthService } from "./modules/auth/services/auth.service";
import { IAuthService } from "./modules/auth/services/auth.service.interface";
import { UserService } from "./modules/users/services/user.service";
import { IUserService } from "./modules/users/services/user.service.interface";

export class ServiceProvider {
    static _authServiceInstance: AuthService;
    static _userServiceInstance: UserService;

    static get authService(): IAuthService {
        if (!this._authServiceInstance)
            this._authServiceInstance = new AuthService();
        return this._authServiceInstance;
    }

    static get userService(): IUserService {
        if (!this._userServiceInstance)
            this._userServiceInstance = new UserService();
        return this._userServiceInstance;
    }
}
