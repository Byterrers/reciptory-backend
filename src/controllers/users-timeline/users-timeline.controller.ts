import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  HttpStatus,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { UsersTimelineService } from './users-timeline.service';
import { UsersTimelineDto } from './dto/users-timeline.dto';

// Entities.

@Controller('users-timeline')
export class UsersTimelineController {
  constructor(private readonly usersTimelineService: UsersTimelineService) {}

  @Get(':userId')
  async getUsersTimelineByUserId(@Param('userId') userId, @Res() res) {
    const userTimeline = await this.usersTimelineService.getUsersTimelineByUserId(
      userId
    );
    return res.status(HttpStatus.OK).json(userTimeline);
  }

  @Post()
  async createUsersTimeline(
    @Body() usersTimelineDTO: UsersTimelineDto,
    @Res() res
  ) {
    const { userId, timeline } = usersTimelineDTO;
    const newUsersTimeline = await this.usersTimelineService.insertUsersTimeline(
      userId,
      timeline
    );
    return res.status(HttpStatus.OK).json(newUsersTimeline);
  }

  @Get('advanced-user-timeline/:userId')
  async getAdvancedUsersTimelineByUserId(@Param('userId') userId, @Res() res) {
    const userTimeline = await this.usersTimelineService.getAdvancedUsersTimelineByUserId(
      userId
    );
    return res.status(HttpStatus.OK).json(userTimeline);
  }
}
