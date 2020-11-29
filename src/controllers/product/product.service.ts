import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities.
import { ProductInterface } from './interfaces/product.interface';
import { ProductModel } from './models/product.model';
import { ProductDto } from './dto/product.dto';

// Outsider services.
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { IngredientModel } from '../ingredient/models/ingredient.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
    @Inject(forwardRef(() => UsersInventoryService))
    private readonly usersInventoryService: UsersInventoryService
  ) {}

  async getProducts(): Promise<ProductModel[]> {
    const products = await this.productModel.find().exec();
    return products.map((r) => {
      const { _id, name, ingredient, quantity, unit, expirationDate } = r;
      return { id: _id, name, ingredient, quantity, unit, expirationDate };
    });
  }

  async getProductById(productId: string): Promise<ProductModel> {
    const {
      _id,
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    } = await this.findProductById(productId);
    const product = { _id, name, ingredient, quantity, unit, expirationDate };
    return product;
  }

  async insertProduct(
    name: string,
    ingredient: IngredientModel,
    quantity: number,
    unit: string,
    expirationDate: string
  ): Promise<ProductModel> {
    const newProduct = new this.productModel({
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    });

    const response = await newProduct.save();
    return response;
  }

  async insertUserProduct(
    userId: string,
    name: string,
    ingredient: IngredientModel,
    quantity: number,
    unit: string,
    expirationDate: string,
    place: number
  ): Promise<ProductModel> {
    const newProduct = new this.productModel({
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    });

    /* Checking for no duplicated names within the userInventory */
    const advancedUserInventory = await this.usersInventoryService.getUserInventoryByUserId(
      userId
    );

    const inventoryProducts = [
      ...advancedUserInventory.refrigerator,
      ...advancedUserInventory.freezer,
      ...advancedUserInventory.pantry,
      ...advancedUserInventory.others
    ];

    const existsProductWithSameName = inventoryProducts.find(
      (p) => p.name === name
    );

    if (existsProductWithSameName) {
      throw new ConflictException(
        `You already have a product named ${name} in your inventory`
      );
    }

    /* Insert user product */

    const newInsertedProduct = await newProduct.save();

    const userInventory = await this.usersInventoryService.findUsersInventoryByUserId(
      userId
    );

    let userProducts;

    switch (place) {
      case 0:
        userProducts = userInventory.refrigerator as string[];
        userProducts.push(newInsertedProduct.id);
        await this.usersInventoryService.updateUsersInventory(
          userInventory.id,
          null,
          userProducts,
          null,
          null,
          null
        );
        break;
      case 1:
        userProducts = userInventory.freezer as string[];
        userProducts.push(newInsertedProduct.id);
        await this.usersInventoryService.updateUsersInventory(
          userInventory.id,
          null,
          null,
          userProducts,
          null,
          null
        );
        break;
      case 2:
        userProducts = userInventory.pantry as string[];
        userProducts.push(newInsertedProduct.id);
        await this.usersInventoryService.updateUsersInventory(
          userInventory.id,
          null,
          null,
          null,
          userProducts,
          null
        );
        break;
      case 3:
        userProducts = userInventory.others as string[];
        userProducts.push(newInsertedProduct.id);
        await this.usersInventoryService.updateUsersInventory(
          userInventory.id,
          null,
          null,
          null,
          null,
          userProducts
        );
        break;
      default:
        userProducts = userInventory.others as string[];
        userProducts.push(newInsertedProduct.id);
        await this.usersInventoryService.updateUsersInventory(
          userInventory.id,
          null,
          null,
          null,
          null,
          userProducts
        );
        break;
    }

    return newInsertedProduct;
  }

  async insertUserScannedProducts(
    userId: string,
    products: ProductDto[],
    place: number
  ) {
    // const advancedUserInventory = await this.usersInventoryService.getUserInventoryByUserId(
    //   userId
    // );

    // const inventoryProducts = [
    //   ...advancedUserInventory.refrigerator,
    //   ...advancedUserInventory.freezer,
    //   ...advancedUserInventory.pantry,
    //   ...advancedUserInventory.others
    // ];

    const userInventory = await this.usersInventoryService.findUsersInventoryByUserId(
      userId
    );

    for await (const product of products) {
      const newProduct = new this.productModel({
        name: product.name,
        ingredient: product.ingredient,
        quantity: product.quantity,
        unit: product.unit,
        expirationDate: product.expirationDate
      });

      /* Checking for no duplicated names within the userInventory */

      // const existsProductWithSameName = inventoryProducts.find(
      //   (p) => p.name === product.name
      // );

      // if (existsProductWithSameName) {
      //   throw new ConflictException(
      //     `You already have a product named ${product.name} in your inventory`
      //   );
      // }

      /* Insert user product */

      const newInsertedProduct = await newProduct.save();

      let userProducts;

      switch (place) {
        case 0:
          userProducts = userInventory.refrigerator as string[];
          userProducts.push(newInsertedProduct.id);
          await this.usersInventoryService.updateUsersInventory(
            userInventory.id,
            null,
            userProducts,
            null,
            null,
            null
          );
          break;
        case 1:
          userProducts = userInventory.freezer as string[];
          userProducts.push(newInsertedProduct.id);
          await this.usersInventoryService.updateUsersInventory(
            userInventory.id,
            null,
            null,
            userProducts,
            null,
            null
          );
          break;
        case 2:
          userProducts = userInventory.pantry as string[];
          userProducts.push(newInsertedProduct.id);
          await this.usersInventoryService.updateUsersInventory(
            userInventory.id,
            null,
            null,
            null,
            userProducts,
            null
          );
          break;
        case 3:
          userProducts = userInventory.others as string[];
          userProducts.push(newInsertedProduct.id);
          await this.usersInventoryService.updateUsersInventory(
            userInventory.id,
            null,
            null,
            null,
            null,
            userProducts
          );
          break;
        default:
          userProducts = userInventory.others as string[];
          userProducts.push(newInsertedProduct.id);
          await this.usersInventoryService.updateUsersInventory(
            userInventory.id,
            null,
            null,
            null,
            null,
            userProducts
          );
          break;
      }
    }
  }

  async updateProduct(
    productId: string,
    name: string,
    ingredient: IngredientModel,
    quantity: number,
    unit: string,
    expirationDate: string
  ): Promise<ProductModel> {
    const updateProduct = await this.findProductById(productId);

    if (name) {
      updateProduct.name = name;
    }

    if (ingredient) {
      updateProduct.ingredient = ingredient;
    }

    if (quantity || quantity === 0) {
      updateProduct.quantity = quantity;
    }

    if (unit) {
      updateProduct.unit = unit;
    }

    if (expirationDate) {
      updateProduct.expirationDate = expirationDate;
    }

    const response = await updateProduct.save();
    return response;
  }

  async deleteProduct(productId: string) {
    const response = await this.productModel
      .deleteOne({
        _id: productId
      })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find the product.');
    }
  }

  async deleteUserProduct(userId: string, productId: string) {
    const userInventory = await this.usersInventoryService.findUsersInventoryByUserId(
      userId
    );

    let userRefrigerator = userInventory.refrigerator as string[];
    userRefrigerator = userRefrigerator.filter((p) => p !== productId);
    let userFreezer = userInventory.freezer as string[];
    userFreezer = userFreezer.filter((p) => p !== productId);
    let userPantry = userInventory.pantry as string[];
    userPantry = userPantry.filter((p) => p !== productId);
    let userOthers = userInventory.others as string[];
    userOthers = userOthers.filter((p) => p !== productId);

    await this.usersInventoryService.updateUsersInventory(
      userInventory.id,
      null,
      userRefrigerator,
      userFreezer,
      userPantry,
      userOthers
    );

    const response = await this.productModel
      .deleteOne({
        _id: productId
      })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find the product.');
    }
  }

  /*Util*/

  async findProductById(productId: string) {
    let product;
    try {
      product = await this.productModel.findById(productId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find your product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find your product.');
    }

    return product;
  }
}
