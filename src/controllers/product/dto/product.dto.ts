import { IngredientModel } from "src/controllers/ingredient/models/ingredient.model";

export class ProductDto {
    name: string;
    ingredient: IngredientModel;
    quantity: number;
    unit: string;
    expirationDate?: string;
    constructor() {}
}
