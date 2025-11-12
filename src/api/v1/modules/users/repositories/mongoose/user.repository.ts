
import { SortOrder } from "mongoose";
import { ICreateUser, IUpdateUser, IUserEntity } from "../../models/user.model.interface";
import { IUserRepository } from "../user.repository.interface";
import { User } from "../../models/mongoose/user.model";

export class MongoUserRepository implements IUserRepository {
  async create(data: ICreateUser): Promise<IUserEntity> {
    const user = await User.create(data);
    return this.toEntity(user);
  }

  async findById(id: string, isPasswordRequired: boolean = false): Promise<IUserEntity | null> {
    const user = await User.findById(id);
    return user ? this.toEntity(user, isPasswordRequired) : null;
  }

  async findByEmail(email: string, isPasswordRequired: boolean = false): Promise<IUserEntity | null> {
    const user = await User.findOne({ email });
    return user ? this.toEntity(user, isPasswordRequired) : null;
  }

  async findByUsername(username: string): Promise<IUserEntity | null> {
    const user = await User.findOne({ username: username.toLowerCase() });
    return user ? this.toEntity(user) : null;
  }

  async findByEmailOrUsername({ email, username }: { email?: string; username?: string }) {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    return user ? this.toEntity(user) : null;
  }

  async findAll(sort: Record<string, SortOrder> = { createdAt: -1 }) {
    const users = await User.find().sort(sort);
    return users.map((user) => this.toEntity(user));
  }

  async updateById(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null> {
    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    return updated ? this.toEntity(updated) : null;
  }

  async deleteById(id: string): Promise<IUserEntity | null> {
    const deleted = await User.findByIdAndDelete(id);
    return deleted ? this.toEntity(deleted) : null;
  }

  async removeRefreshTokenById(userId: string) {
    const updated = await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
    return updated ? this.toEntity(updated) : null;
  }

  async updateAccountDetails(userId: string, updates: Partial<IUpdateUser>) {
    return this.updateById(userId, updates);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await User.findOne({ username });
    return !!user;
  }

  private toEntity(userDoc: any, isPasswordRequired: boolean = false): IUserEntity {
    const obj = userDoc.toObject ? userDoc.toObject() : userDoc;

    // Destructure sensitive fields
    const { password, refreshToken, _id, ...safeData } = obj;

    const baseEntity: IUserEntity = {
      ...safeData,
      id: _id?.toString(),
    };

    if (isPasswordRequired && password) {
      baseEntity.password = password;
    }

    return baseEntity;
  }


}
