import { RecipeInterface } from '../interfaces/recipe.interface';
import { NutrientModel } from '../../../controllers/nutrient/models/nutrient.model';
import { PreferenceModel } from '../../../controllers/preference/models/preference.model';
import { AllergyModel } from '../../../controllers/allergy/models/allergy.model';

export class RecipeDto implements RecipeInterface {
  name: string;
  cookingTime: string;
  calories: number;
  ingredients: any[];
  steps: string[];
  nutrients: NutrientModel[];
  preferences: PreferenceModel[];
  allergies: AllergyModel[];
  tags: string[];
  author: string;
  authorId: string;
  shared: boolean;
  rating?: number;
  rates?: [];
  comments?: [];
  image: string;
  originalId: string;
  isCopy: boolean;
  timestamp?: Date;

  constructor() {}
}
