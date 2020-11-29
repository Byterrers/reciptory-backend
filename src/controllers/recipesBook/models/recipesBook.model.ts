import { IRecipesBook } from '../interfaces/recipesBook.interface';

export class RecipesBookModel implements IRecipesBook {
  id?: string;
  name: string;
  recipes: string[];
  userId: string;
  favorite: boolean;

  constructor() {}
}
