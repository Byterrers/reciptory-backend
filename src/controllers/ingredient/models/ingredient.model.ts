import { IngredientInterface } from '../interfaces/ingredient.interface';

export class IngredientModel implements IngredientInterface {
  id?: string;
  categoryId: string;
  name: string;

  constructor() {}
}
