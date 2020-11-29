import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* Entities */
import { IngredientInterface } from './interfaces/ingredient.interface';
import { IngredientModel } from './models/ingredient.model';

@Injectable()
export class IngredientService {
  constructor(
    @InjectModel('Ingredient')
    private readonly ingredientModel: Model<IngredientInterface>,
  ) {}

  /* UserInfo CRUD */

  async getIngredients(): Promise<IngredientModel[]> {
    const ingredient = await this.ingredientModel.find().exec();
    return ingredient.map(r => {
      const { _id, name, categoryId } = r;
      return {
        id: _id,
        name,
        categoryId,
      };
    });
  }

  async getIngredientById(ingredientId: string): Promise<IngredientModel> {
    const { _id, name, categoryId } = await this.findIngredientById(
      ingredientId,
    );
    const ingredient = {
      id: _id,
      name,
      categoryId,
    };
    return ingredient;
  }

  async insertIngredient(
    name: string,
    categoryId: string,
  ): Promise<IngredientModel> {
    const newIngredient = new this.ingredientModel({
      name,
      categoryId,
    });
    const response = await newIngredient.save();
    return response;
  }

  async updateIngredient(
    ingredientId: string,
    name: string,
    categoryId: string,
  ): Promise<IngredientModel> {
    const updateIngredient = await this.findIngredientById(ingredientId);

    if (ingredientId) {
      updateIngredient.ingredientId = ingredientId;
    }

    if (name) {
      updateIngredient.firstname = name;
    }

    if (categoryId) {
      updateIngredient.categoryId = categoryId;
    }

    const response = await updateIngredient.save();
    return response;
  }

  async deleteIngredient(ingredientId: string) {
    const response = await this.ingredientModel
      .deleteOne({ _id: ingredientId })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find the Ingredient.');
    }
  }

  /* Search */

  async searchIngredients(name: string) {
    let ingredients;

    try {
      ingredients = await this.ingredientModel
        .find({ name: new RegExp(`.*(${name}).*`, 'gi') })
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your Ingredient.');
    }

    if (!ingredients) {
      throw new NotFoundException('Could not find your Ingredient.');
    }

    return ingredients.map(i => {
      return {
        id: i._id.toHexString(),
        name: i.name
      };
    });
  }

  /* Util */

  async findIngredientById(ingredientId: string) {
    let ingredient;

    try {
      ingredient = await this.ingredientModel.findById(ingredientId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find your Ingredient.');
    }

    if (!ingredient) {
      throw new NotFoundException('Could not find your Ingredient.');
    }

    return ingredient;
  }
}
