import { Test, TestingModule } from '@nestjs/testing';
import { UsersTimelineController } from './users-timeline.controller';

describe('UsersTimeline Controller', () => {
  let controller: UsersTimelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersTimelineController],
    }).compile();

    controller = module.get<UsersTimelineController>(UsersTimelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
