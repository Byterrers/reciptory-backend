import { NutrientInterface } from '../interfaces/nutrient.interface';

export class NutrientModel implements NutrientInterface {
  id?: string;
  name: string;

  constructor() {}
}
