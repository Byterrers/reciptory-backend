import { Test, TestingModule } from '@nestjs/testing';
import { UsersInfoService } from './users-info.service';

describe('UsersInfoService', () => {
  let service: UsersInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInfoService],
    }).compile();

    service = module.get<UsersInfoService>(UsersInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
