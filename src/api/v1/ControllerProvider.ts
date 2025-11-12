import { AuthController } from "./modules/auth/controllers/auth.controller";
import { IAuthController } from "./modules/auth/controllers/auth.controller.interface";
import { UserController } from "./modules/users/controllers/user.controller";
import { IUserController } from "./modules/users/controllers/user.controller.interface";
export class ControllerProvider {
    static _userControllerInstance: UserController;
    static _authControllerInstance: AuthController;

    static get userController(): IUserController {
        if (!this._userControllerInstance)
            this._userControllerInstance = new UserController();
        return this._userControllerInstance;
    }

    static get authController(): IAuthController {
        if (!this._authControllerInstance)
            this._authControllerInstance = new AuthController();
        return this._authControllerInstance;
    }
}
