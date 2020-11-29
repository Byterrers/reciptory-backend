import { Test, TestingModule } from '@nestjs/testing';
import { UsersInfoController } from './users-info.controller';

describe('UsersInfo Controller', () => {
  let controller: UsersInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersInfoController],
    }).compile();

    controller = module.get<UsersInfoController>(UsersInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
