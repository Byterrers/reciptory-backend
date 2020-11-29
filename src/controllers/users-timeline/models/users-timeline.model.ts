import { IUsersTimeline } from '../interfaces/users-timeline.interface';

export class UsersTimelineModel implements IUsersTimeline {
  id?: string;
  userId: string;
  timeline: any[];
}
