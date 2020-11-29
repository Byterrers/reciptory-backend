import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities.
import { IUsersTimeline } from './interfaces/users-timeline.interface';
import { UsersTimelineModel } from './models/users-timeline.model';

// Services.
import { UsersInfoService } from '../users-info/users-info.service';

@Injectable()
export class UsersTimelineService {
  constructor(
    @InjectModel('UsersTimeline')
    private readonly usersTimelineModel: Model<IUsersTimeline>,
    private readonly usersInfoService: UsersInfoService
  ) {}

  async getUsersTimelineByUserId(userId: string): Promise<UsersTimelineModel> {
    const { _id, timeline, ...rest } = await this.findUsersTimelineByUserId(
      userId
    );

    return {
      id: _id.toHexString(),
      userId,
      timeline
    };
  }

  async getAdvancedUsersTimelineByUserId(userId: string): Promise<any[]> {
    const usersFollowing = await this.usersInfoService.getUserFollowing(userId);
    const usersFollowingId = usersFollowing.map((u) => u.userId);

    const timeline = [];
    for await (const userFollowingId of usersFollowingId) {
      const userFollowingTimeline = await this.findUsersTimelineByUserId(
        userFollowingId
      );
      const userFollowingTimelineEvents = userFollowingTimeline.timeline as any[];
      timeline.push(...userFollowingTimelineEvents);
    }

    timeline
      .sort((a, b) => {
        return b.timestamp - a.timestamp;
      })
      .slice(0, 50);

    return timeline;
  }

  async insertUsersTimeline(userId: string, timeline: any[]) {
    const usersTimeline = new this.usersTimelineModel({
      userId,
      timeline
    });

    usersTimeline.save();
  }

  async addEventToUsersTimeline(userId: string, event: any) {
    const usersTimeline = await this.findUsersTimelineByUserId(userId);
    const usersTimelineEvents = usersTimeline.timeline as any[];

    usersTimelineEvents.unshift(event);

    if (usersTimelineEvents.length > 100) {
      usersTimelineEvents.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
      usersTimelineEvents.pop();
    }

    usersTimeline.timeline = usersTimelineEvents;

    const response = await usersTimeline.save();
    return response;
  }

  /* Util. */

  async findUsersTimelineByUserId(userId: string) {
    let usersTimeline;

    try {
      usersTimeline = await this.usersTimelineModel
        .findOne({ userId: new RegExp(userId, 'i') })
        .exec();
    } catch (e) {
      throw new NotFoundException(
        'Could not find a timeline related to that id.'
      );
    }

    if (!usersTimeline) {
      throw new NotFoundException(
        'Could not find a timeline related to that id.'
      );
    }

    return usersTimeline;
  }
}
