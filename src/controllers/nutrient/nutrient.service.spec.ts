import { Test, TestingModule } from '@nestjs/testing';
import { NutrientService } from './nutrient.service';

describe('NutrientService', () => {
  let service: NutrientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutrientService],
    }).compile();

    service = module.get<NutrientService>(NutrientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
