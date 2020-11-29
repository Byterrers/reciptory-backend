import { Test, TestingModule } from '@nestjs/testing';
import { NutrientController } from './nutrient.controller';

describe('Nutrient Controller', () => {
  let controller: NutrientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutrientController],
    }).compile();

    controller = module.get<NutrientController>(NutrientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
