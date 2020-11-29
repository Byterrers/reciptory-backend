import { Test, TestingModule } from '@nestjs/testing';
import { UsersInventoryService } from './users-inventory.service';

describe('UsersInventoryService', () => {
  let service: UsersInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInventoryService],
    }).compile();

    service = module.get<UsersInventoryService>(UsersInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
