import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShoppingListInterface } from './interfaces/shoppingList.interface';
import { ShoppingListModel } from './models/shoppingList.model';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectModel('ShoppingList')
    private readonly shoppingListModel: Model<ShoppingListInterface>,
  ) {}

  async getShoppingLists(): Promise<ShoppingListModel[]> {
    const shoppingLists = await this.shoppingListModel.find().exec();
    return shoppingLists.map(r => {
      const { _id, name, products, userId } = r;
      return {
        id: _id,
        name,
        products,
        userId,
      };
    });
  }

  async getShoppingListById(
    shoppingListId: string,
  ): Promise<ShoppingListModel> {
    const { _id, userId, name, products } = await this.findShoppingListById(
      shoppingListId,
    );
    const shoppingList = {
      id: _id,
      userId,
      name,
      products,
    };

    return shoppingList;
  }

  async insertShoppingList(
    userId: string,
    name: string,
    products: string[],
  ): Promise<ShoppingListModel> {
    const newShoppingList = new this.shoppingListModel({
      name,
      products,
      userId,
    });

    const response = await newShoppingList.save();
    return response;
  }

  async updateShoppingList(
    shoppingListId: string,
    userId: string,
    name: string,
    products: string[],
  ): Promise<ShoppingListModel> {
    const updatedShoppingList = await this.findShoppingListById(shoppingListId);

    if (name) {
      updatedShoppingList.name = name;
    }

    if (products) {
      updatedShoppingList.products = products;
    }

    if (userId) {
      updatedShoppingList.userId = userId;
    }

    const response = await updatedShoppingList.save();
    return response;
  }

  async deleteShoppingList(shoppingListId: string) {
    const response = await this.shoppingListModel
      .deleteOne({ _id: shoppingListId })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find shopping list.');
    }
  }

  /* Utilities. */

  async findShoppingListById(shoppingListId: string) {
    let shoppingList;

    try {
      shoppingList = await this.shoppingListModel
        .findById(shoppingListId)
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find shopping list.');
    }

    if (!shoppingList) {
      throw new NotFoundException('Could not find shopping list.');
    }

    return shoppingList;
  }

  async findShoppingListByUserId(userId: string) {
    let shoppingList;

    try {
      shoppingList = await this.shoppingListModel
        .findOne(userId)
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find shopping list.');
    }

    if (!shoppingList) {
      throw new NotFoundException('Could not find shopping list.');
    }

    return shoppingList;
  }
}
