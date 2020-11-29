
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesBookController } from './recipesBook.controller';

describe('RecipesBook Controller', () => {
  let controller: RecipesBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesBookController],
    }).compile();

    controller = module.get<RecipesBookController>(RecipesBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
