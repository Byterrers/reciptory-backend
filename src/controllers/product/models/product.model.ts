import { ProductInterface } from '../interfaces/product.interface';
import { IngredientModel } from 'src/controllers/ingredient/models/ingredient.model';

export class ProductModel implements ProductInterface {
    name: string;
    ingredient: IngredientModel;
    quantity: number;
    unit: string;
    expirationDate: string;

  constructor() {}
}
