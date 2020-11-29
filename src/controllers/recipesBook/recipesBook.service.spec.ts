import { Test, TestingModule } from '@nestjs/testing';
import { RecipesBookService } from './recipesBook.service';

describe('RecipesBookService', () => {
  let service: RecipesBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesBookService],
    }).compile();

    service = module.get<RecipesBookService>(RecipesBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
