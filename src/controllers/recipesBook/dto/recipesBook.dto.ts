import { IRecipesBook } from '../interfaces/recipesBook.interface';

export class RecipesBookDto implements IRecipesBook {
  name: string;
  recipes: string[];
  userId: string;
  favorite: boolean;

  constructor() {}
}
