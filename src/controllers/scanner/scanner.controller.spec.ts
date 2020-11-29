import { Test, TestingModule } from '@nestjs/testing';
import { ScannerController } from './scanner.controller';

describe('Scanner Controller', () => {
  let controller: ScannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScannerController],
    }).compile();

    controller = module.get<ScannerController>(ScannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
