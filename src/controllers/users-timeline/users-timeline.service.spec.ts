import { Test, TestingModule } from '@nestjs/testing';
import { UsersTimelineService } from './users-timeline.service';

describe('UsersTimelineService', () => {
  let service: UsersTimelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersTimelineService],
    }).compile();

    service = module.get<UsersTimelineService>(UsersTimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
