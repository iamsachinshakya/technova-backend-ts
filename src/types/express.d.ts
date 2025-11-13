import { IAuthUser } from "../api/v1/modules/users/models/user.model.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IAuthUser;
            file?: Express.Multer.File;   // for avatar / icon uploads
            files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]; // for multiple files
        }
    }
}
