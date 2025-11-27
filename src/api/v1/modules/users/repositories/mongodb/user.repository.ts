
import { SortOrder } from "mongoose";
import { IRegisterData, IUpdateUserData, IUserEntity } from "../../models/user.model.interface";
import { IUserRepository } from "../user.repository.interface";
import { User } from "../../models/mongoose/user.model";

export class MongoUserRepository implements IUserRepository {
  async create(data: IRegisterData): Promise<IUserEntity> {
    const user = await User.create(data);
    return this.toEntity(user);
  }

  async findById(id: string, isRequiredSensitiveData: boolean = false): Promise<IUserEntity | null> {
    const user = await User.findById(id);
    return user ? this.toEntity(user, isRequiredSensitiveData) : null;
  }

  async findByEmail(email: string, isRequiredSensitiveData: boolean = false): Promise<IUserEntity | null> {
    const user = await User.findOne({ email });
    return user ? this.toEntity(user, isRequiredSensitiveData) : null;
  }

  async findByUsername(username: string): Promise<IUserEntity | null> {
    const user = await User.findOne({ username: username.toLowerCase() });
    return user ? this.toEntity(user) : null;
  }

  async findByEmailOrUsername({ email, username }: { email?: string; username?: string }) {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    return user ? this.toEntity(user) : null;
  }

  async findAll(
    filter: { search?: string; role?: string } = {},
    options: { page?: number; limit?: number; sort?: Record<string, SortOrder> } = {}
  ): Promise<{ data: IUserEntity[]; total: number }> {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: any[] = [];
    const match: any = {};

    if (filter.search) {
      match.$or = [
        { fullName: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
        { username: { $regex: filter.search, $options: "i" } },
      ];
    }

    if (filter.role && filter.role !== "all") {
      match.role = filter.role;
    }

    if (Object.keys(match).length) {
      aggregationPipeline.push({ $match: match });
    }

    aggregationPipeline.push({
      $facet: {
        data: [
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    const result = await User.aggregate(aggregationPipeline);

    const data = result[0]?.data?.map(this.toEntity.bind(this)) || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return { data, total };
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

  async updateAccountDetails(userId: string, updates: Partial<IUpdateUserData>) {
    return this.updateById(userId, updates);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await User.findOne({ username });
    return !!user;
  }


  async addFollower(targetUserId: string, followerId: string): Promise<void> {
    await User.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: followerId } },
      { new: true }
    );
  }

  async removeFollower(targetUserId: string, followerId: string): Promise<void> {
    await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: followerId } },
      { new: true }
    );
  }

  async addFollowing(userId: string, targetUserId: string): Promise<void> {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: targetUserId } },
      { new: true }
    );
  }

  async removeFollowing(userId: string, targetUserId: string): Promise<void> {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: targetUserId } },
      { new: true }
    );
  }

  async findFollowers(userId: string): Promise<IUserEntity[]> {
    const user = await User.findById(userId)
      .populate("followers", "fullName username avatar")
      .lean();

    if (!user) return [];
    return (user.followers as unknown as IUserEntity[]) || [];
  }

  async findFollowing(userId: string): Promise<IUserEntity[]> {
    const user = await User.findById(userId)
      .populate("following", "fullName username avatar")
      .lean();

    if (!user) return [];
    return (user.following as unknown as IUserEntity[]) || [];
  }

  private toEntity(userDoc: any, isRequiredSensitiveData: boolean = false): IUserEntity {
    const obj = userDoc.toObject ? userDoc.toObject() : userDoc;

    // Destructure sensitive fields
    const { password, refreshToken, _id, ...safeData } = obj;

    const baseEntity: IUserEntity = {
      ...safeData,
      id: _id?.toString(),
    };

    if (isRequiredSensitiveData) {
      baseEntity.password = password;
      baseEntity.refreshToken = refreshToken;
    }

    return baseEntity;
  }


}
