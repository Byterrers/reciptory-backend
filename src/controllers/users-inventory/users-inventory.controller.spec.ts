import { Test, TestingModule } from '@nestjs/testing';
import { UsersInventoryController } from './users-inventory.controller';

describe('UsersInventory Controller', () => {
  let controller: UsersInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersInventoryController],
    }).compile();

    controller = module.get<UsersInventoryController>(UsersInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
