import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersTimelineController } from './users-timeline.controller';
import { UsersTimelineService } from './users-timeline.service';
import { UsersTimelineSchema } from './schemas/users-timeline.schema';

// Outsider services.
import { UsersInfoService } from '../users-info/users-info.service';

// Outsider schemas.
import { UsersInfoSchema } from '../users-info/schemas/usersInfo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UsersTimeline', schema: UsersTimelineSchema },
      { name: 'UsersInfo', schema: UsersInfoSchema },
    ]),
  ],
  providers: [UsersTimelineService, UsersInfoService],
  controllers: [UsersTimelineController]
})
export class UsersTimelineModule {}
