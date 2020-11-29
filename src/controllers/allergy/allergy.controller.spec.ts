import { Test, TestingModule } from '@nestjs/testing';
import { AllergyController } from './allergy.controller';

describe('Allergy Controller', () => {
  let controller: AllergyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergyController],
    }).compile();

    controller = module.get<AllergyController>(AllergyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
