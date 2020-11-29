import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Headers,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { UsersInfoService } from './users-info.service';

// Entities.
import { UsersInfoDto } from './dto/users-info.dto';

@Controller('users-info')
export class UsersInfoController {
  constructor(private readonly userInfoService: UsersInfoService) {}

  /* UserInfo CRUD */

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUserInfos(@Res() res) {
    const userInfos = await this.userInfoService.getUsersInfos();
    return res.status(HttpStatus.OK).json(userInfos);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserInfo(@Param('id') userInfoId, @Res() res) {
    const userInfo = await this.userInfoService.getUsersInfoById(userInfoId);
    return res.status(HttpStatus.OK).json(userInfo);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUserInfo(@Body() createUserInfoDTO: UsersInfoDto, @Res() res) {
    const {
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
    } = createUserInfoDTO;
    const newUserInfo = await this.userInfoService.insertUsersInfo(
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
    );
    return res.status(HttpStatus.OK).json(newUserInfo);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateUserInfo(
    @Param('id') userInfoId,
    @Body() createUserInfoDTO: UsersInfoDto,
    @Res() res,
  ) {
    const {
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
    } = createUserInfoDTO;
    const updatedUserInfo = await this.userInfoService.updateUsersInfo(
      userInfoId,
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
    );

    return res.status(HttpStatus.OK).json(updatedUserInfo);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUserInfo(@Param('id') userInfoId, @Res() res) {
    await this.userInfoService.deleteUsersInfo(userInfoId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* Follow/Unfollow */

  @Put(':id/follow-unfollow/:userToFollowUnfollowId')
  @Patch(':id/follow-unfollow/:userToFollowUnfollowId')
  async followUnfollow(
    @Param('id') userId,
    @Param('userToFollowUnfollowId') userToFollowUnfollowId,
    @Res() res,
  ) {
    const userInfo = await this.userInfoService.followUnfollow(
      userId,
      userToFollowUnfollowId,
    );
    return res.status(HttpStatus.OK).json(userInfo);
  }

  @Get(':id/followers')
  async getUserFollowers(@Param('id') userId, @Res() res) {
    const followers = await this.userInfoService.getUserFollowers(userId);
    return res.status(HttpStatus.OK).json(followers);
  }

  @Get(':id/following')
  async getUserFollowing(@Param('id') userId, @Res() res) {
    const following = await this.userInfoService.getUserFollowing(userId);
    return res.status(HttpStatus.OK).json(following);
  }

  /* Search */

  // @UseGuards(AuthGuard('jwt'))
  @Get('search/users-info')
  async searchUserInfos(@Query('username') username, @Res() res) {
    const userInfos = await this.userInfoService.searchUserInfos(username);
    return res.status(HttpStatus.OK).json(userInfos);
  }

  /* Outsider getters */

  @Get(':id/user-info')
  async getUserInfoByUserId(@Param('id') userId, @Res() res) {
    const userInfo = await this.userInfoService.getUserInfoByUserId(userId);
    return res.status(HttpStatus.OK).json(userInfo);
  }

  @Get(':id/shoppingLists')
  async getUserShoppingLists(@Param('id') userId, @Res() res) {
    const userShoppingLists = await this.userInfoService.getUserShoppingLists(
      userId,
    );
    return res.status(HttpStatus.OK).json(userShoppingLists);
  }
}
