import { IUserEntity } from "../../modules/users/models/user.model.interface";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface UserPaginatedData {
    data: IUserEntity[];
    pagination: PaginationMeta;
}