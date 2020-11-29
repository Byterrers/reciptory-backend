import { IUsersTimeline } from '../interfaces/users-timeline.interface';

export class UsersTimelineDto implements IUsersTimeline {
  id?: string;
  userId: string;
  timeline: any[];
}
