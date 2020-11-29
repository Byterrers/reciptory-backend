import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities.
import { IUsersInfo } from './interfaces/users-info.interface';
import { UsersInfoModel } from './models/users-info.model';
import { PreferenceModel } from '../preference/models/preference.model';
import { AllergyModel } from '../allergy/models/allergy.model';

@Injectable()
export class UsersInfoService {
  constructor(
    @InjectModel('UsersInfo')
    private readonly usersInfoModel: Model<IUsersInfo>
  ) {}

  /* UserInfo CRUD */

  async getUsersInfos(): Promise<UsersInfoModel[]> {
    const usersInfos = await this.usersInfoModel.find().exec();
    return usersInfos.map(r => {
      const {
        _id,
        userId,
        username,
        name,
        gender,
        country,
        city,
        avatar,
        preferences,
        allergies,
        userShoppingLists,
        following,
        followers,
      } = r;
      return {
        id: r._id,
        userId,
        username,
        name,
        gender,
        country,
        city,
        avatar,
        preferences,
        allergies,
        userShoppingLists,
        following,
        followers,
      };
    });
  }

  async getUsersInfoById(usersInfoId: string): Promise<UsersInfoModel> {
    const {
      _id,
      userId,
      username,
      name,
      gender,
      country,
      city,
      avatar,
      preferences,
      allergies,
      userShoppingLists,
      following,
      followers,
    } = await this.findUsersInfoById(usersInfoId);
    const usersInfo = {
      id: _id,
      userId,
      username,
      name,
      gender,
      country,
      city,
      avatar,
      preferences,
      allergies,
      userShoppingLists,
      following,
      followers,
    };
    return usersInfo;
  }

  async insertUsersInfo(
    userId: string,
    username: string,
    name: string,
    gender: string,
    country: string,
    city: string,
    avatar: string,
    preferences: PreferenceModel[],
    allergies: AllergyModel[],
    userShoppingLists: string[],
    following: string[],
    followers: string[],
  ): Promise<UsersInfoModel> {
    const newUsersInfo = new this.usersInfoModel({
      userId,
      username,
      name,
      gender,
      country,
      city,
      avatar,
      preferences,
      allergies,
      userShoppingLists,
      following,
      followers,
    });
    const response = await newUsersInfo.save();
    return response;
  }

  async updateUsersInfo(
    userInfoId: string,
    userId: string,
    username: string,
    name: string,
    gender: string,
    country: string,
    city: string,
    avatar: string,
    preferences: PreferenceModel[],
    allergies: AllergyModel[],
    userShoppingLists: string[],
    following: string[],
    followers: string[],
  ): Promise<UsersInfoModel> {
    const updateUserInfo = await this.findUsersInfoById(userInfoId);

    if (username) {
      updateUserInfo.username = username;
    }

    if (name) {
      updateUserInfo.name = name;
    }

    if (gender) {
      updateUserInfo.gender = gender;
    }

    if (country) {
      updateUserInfo.country = country;
    }

    if (city) {
      updateUserInfo.city = city;
    }

    if (avatar) {
      updateUserInfo.avatar = avatar;
    }

    if (preferences) {
      updateUserInfo.preferences = preferences;
    }

    if (allergies) {
      updateUserInfo.allergies = allergies;
    }

    if (userShoppingLists) {
      updateUserInfo.userShoppingLists = userShoppingLists.filter(
        i => i !== '',
      );

      updateUserInfo.userShoppingLists = Array.from(new Set(updateUserInfo.userShoppingLists));
    }

    if (following) {
      updateUserInfo.following = following;
    }

    if (followers) {
      updateUserInfo.followers = followers;
    }

    const updatedUserInfo = await updateUserInfo.save();

    const response = {
      id: updatedUserInfo._id.toHexString(),
      userId: updatedUserInfo.userId,
      username: updatedUserInfo.username,
      name: updatedUserInfo.name,
      gender: updatedUserInfo.gender,
      country: updatedUserInfo.country,
      city: updatedUserInfo.city,
      avatar: updatedUserInfo.avatar,
      preferences: updatedUserInfo.preferences,
      allergies: updatedUserInfo.allergies,
      userShoppingLists: updatedUserInfo.userShoppingLists,
      following: updatedUserInfo.following,
      followers: updatedUserInfo.followers,
    };

    return response;
  }

  async deleteUsersInfo(usersInfoId: string) {
    const response = await this.usersInfoModel
      .deleteOne({ userId: usersInfoId })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find the UsersInfo.');
    }
  }

  /* User stuff getters */

  async getUserInfoByUserId(userId: string) {
    const usersInfo = await this.findUsersInfoByUserId(userId);

    return usersInfo;
  }

  async getUserShoppingLists(_userId: string) {
    // const usersInfo = await this.findUsersInfoByUserId(_userId);

    // const userShoppingListIdList = usersInfo.userShoppingLists;
    // const userShoppingLists = [];
    // for await (const userShoppingListId of userShoppingListIdList) {
    //   const {
    //     _id,
    //     userId,
    //     name,
    //     products,
    //   } = await this.shoppingListService.findShoppingListById(
    //     userShoppingListId,
    //   );
    //   const shoppingList = {
    //     id: _id,
    //     userId,
    //     name,
    //     products,
    //   };
    //   userShoppingLists.push(shoppingList);
    // }

    // return userShoppingLists;
  }

  /* Follow/Unfollow */

  async followUnfollow(userId: string, userToFollowUnfollowId: string) {
    if (userId === userToFollowUnfollowId) {
      throw new ForbiddenException('Not in my turn, smartass');
    }

    const userInfo = await this.findUsersInfoByUserId(userId);
    const userInfoFollowedUnfollowed = await this.findUsersInfoByUserId(
      userToFollowUnfollowId,
    );

    const following = (userInfo.following as string[]).find(
      u => u === userToFollowUnfollowId,
    );

    if (following) {
      userInfo.following = userInfo.following.filter(
        u => u !== userToFollowUnfollowId,
      );
      userInfoFollowedUnfollowed.followers = userInfoFollowedUnfollowed.followers.filter(
        u => u !== userId,
      );
    } else {
      userInfo.following.push(userToFollowUnfollowId);
      userInfoFollowedUnfollowed.followers.push(userId);
    }

    const response = await this.updateUsersInfo(
      userInfo.id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      userInfo.following,
      null,
    );

    await this.updateUsersInfo(
      userInfoFollowedUnfollowed.id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      userInfoFollowedUnfollowed.followers,
    );

    return response;
  }

  async getUserFollowers(userId: string) {
    const userInfo = await this.findUsersInfoByUserId(userId);

    const followers = userInfo.followers as string[];

    const response = [];
    for await (const followerId of followers) {
      const follower = await this.findUsersInfoByUserId(followerId);
      response.push(follower);
    }

    return response;
  }

  async getUserFollowing(userId: string) {
    const userInfo = await this.findUsersInfoByUserId(userId);

    const following = userInfo.following as string[];

    const response = [];
    for await (const followingId of following) {
      const followed = await this.findUsersInfoByUserId(followingId);
      response.push(followed);
    }

    return response;
  }

  /* Search */

  async searchUserInfos(username: string) {
    let userInfos;

    try {
      userInfos = await this.usersInfoModel
        .find({ username: new RegExp(`.*(${username}).*`, 'gi') })
        .exec();
    } catch (e) {
      return [];
    }

    if (!userInfos) {
      return [];
    }

    return userInfos.map(u => {
      return {
        id: u._id.toHexString(),
        userId: u.userId,
        username: u.username,
        name: u.name,
        gender: u.gender,
        country: u.country,
        city: u.city,
        avatar: u.avatar,
        following: u.following,
        followers: u.followers,
      };
    });
  }

  /* Util */

  async findUsersInfoById(usersInfoId: string) {
    let usersInfo;

    try {
      usersInfo = await this.usersInfoModel.findById(usersInfoId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find your UsersInfo.');
    }

    if (!usersInfo) {
      throw new NotFoundException('Could not find your UsersInfo.');
    }

    return usersInfo;
  }

  async findUsersInfoByUserId(userId: string) {
    let usersInfo;

    try {
      usersInfo = await this.usersInfoModel
        .findOne({ userId: new RegExp(userId, 'i') })
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your information.');
    }

    if (!usersInfo) {
      throw new NotFoundException('Could not find your information.');
    }

    return {
      id: usersInfo._id.toHexString(),
      userId: usersInfo.userId,
      username: usersInfo.username,
      name: usersInfo.name,
      gender: usersInfo.gender,
      country: usersInfo.country,
      city: usersInfo.city,
      avatar: usersInfo.avatar,
      preferences: usersInfo.preferences,
      allergies: usersInfo.allergies,
      userShoppingLists: usersInfo.userShoppingLists,
      following: usersInfo.following,
      followers: usersInfo.followers,
    };
  }
}
