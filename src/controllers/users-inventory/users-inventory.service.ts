import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Services.
import { ProductService } from '../product/product.service';

// Entities.
import { IUsersInventory } from './interfaces/users-inventory.interface';
import { UsersInventoryModel } from './models/users-inventory.model';

@Injectable()
export class UsersInventoryService {
  constructor(
    @InjectModel('UsersInventory')
    private readonly usersInventoryModel: Model<IUsersInventory>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {}

  /* UserInventory CRUD */

  async getUsersInventories(): Promise<UsersInventoryModel[]> {
    const usersInventories = await this.usersInventoryModel.find().exec();
    return usersInventories.map((r) => {
      const { userId, freezer, refrigerator, pantry, others } = r;
      return {
        userId,
        refrigerator,
        freezer,
        pantry,
        others
      };
    });
  }

  async getUsersInventoryById(
    usersInventoryId: string
  ): Promise<UsersInventoryModel> {
    const {
      _id,
      userId,
      freezer,
      refrigerator,
      pantry,
      others
    } = await this.findUsersInventoryById(usersInventoryId);
    const usersInfo = {
      id: _id,
      userId,
      freezer,
      refrigerator,
      pantry,
      others
    };
    return usersInfo;
  }

  async insertUsersInventory(
    userId: string,
    refrigerator: string[],
    freezer: string[],
    pantry: string[],
    others: string[]
  ): Promise<UsersInventoryModel> {
    const newUsersInventory = new this.usersInventoryModel({
      userId,
      refrigerator,
      freezer,
      pantry,
      others
    });
    const response = await newUsersInventory.save();
    return response;
  }

  async updateUsersInventory(
    userInventoryId: string,
    userId: string,
    refrigerator: string[],
    freezer: string[],
    pantry: string[],
    others: string[]
  ): Promise<UsersInventoryModel> {
    const updateUsersInventory = await this.findUsersInventoryById(
      userInventoryId
    );

    if (userId) {
      updateUsersInventory.userId = userId;
    }

    if (refrigerator) {
      updateUsersInventory.refrigerator = refrigerator;
    }

    if (freezer) {
      updateUsersInventory.freezer = freezer;
    }

    if (pantry) {
      updateUsersInventory.pantry = pantry;
    }

    if (others) {
      updateUsersInventory.others = others;
    }

    const response = await updateUsersInventory.save();
    return response;
  }

  async deleteUsersInventory(usersInventoryId: string) {
    const response = await this.usersInventoryModel
      .deleteOne({ userId: usersInventoryId })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find your inventory.');
    }
  }

  /* User stuff getters */

  async getUserInventoryByUserId(userId: string) {
    const usersInventory = await this.findUsersInventoryByUserId(userId);

    const userRefrigeratorIdList = usersInventory.refrigerator;
    const userRefrigerator = [];
    for await (const userProductId of userRefrigeratorIdList) {
      const {
        _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      } = await this.productService.findProductById(userProductId);
      const product = {
        id: _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      };
      userRefrigerator.push(product);
    }

    const userFreezerIdList = usersInventory.freezer;
    const userFreezer = [];
    for await (const userProductId of userFreezerIdList) {
      const {
        _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      } = await this.productService.findProductById(userProductId);
      const product = {
        id: _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      };
      userFreezer.push(product);
    }

    const userPantryIdList = usersInventory.pantry;
    const userPantry = [];
    for await (const userProductId of userPantryIdList) {
      const {
        _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      } = await this.productService.findProductById(userProductId);
      const product = {
        id: _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      };
      userPantry.push(product);
    }

    const userOthersIdList = usersInventory.others;
    const userOthers = [];
    for await (const userProductId of userOthersIdList) {
      const {
        _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      } = await this.productService.findProductById(userProductId);
      const product = {
        id: _id,
        ingredient,
        name,
        quantity,
        unit,
        expirationDate
      };
      userOthers.push(product);
    }

    usersInventory.refrigerator = userRefrigerator;
    usersInventory.freezer = userFreezer;
    usersInventory.pantry = userPantry;
    usersInventory.others = userOthers;

    return usersInventory;
  }

  async moveProduct(userId: string, productId: string, locationId: string) {
    const usersInventory = await this.findUsersInventoryByUserId(userId);

    let userFridgeIdList = usersInventory.refrigerator as string[];
    userFridgeIdList = userFridgeIdList.filter((i) => i !== productId);

    let userFreezerIdList = usersInventory.freezer as string[];
    userFreezerIdList = userFreezerIdList.filter((i) => i !== productId);

    let userPantryIdList = usersInventory.pantry as string[];
    userPantryIdList = userPantryIdList.filter((i) => i !== productId);

    let userOthersIdList = usersInventory.others as string[];
    userOthersIdList = userOthersIdList.filter((i) => i !== productId);

    switch (locationId) {
      case '0':
        userFridgeIdList.push(productId);
        break;
      case '1':
        userFreezerIdList.push(productId);
        break;
      case '2':
        userPantryIdList.push(productId);
        break;
      case '3':
        userOthersIdList.push(productId);
        break;
      default:
        break;
    }

    await this.updateUsersInventory(
      usersInventory.id,
      null,
      userFridgeIdList,
      userFreezerIdList,
      userPantryIdList,
      userOthersIdList
    );
  }

  /* Util */

  async findUsersInventoryById(usersInventoryId: string) {
    let usersInventory;

    try {
      usersInventory = await this.usersInventoryModel
        .findById(usersInventoryId)
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your inventory.');
    }

    if (!usersInventory) {
      throw new NotFoundException('Could not find your inventory.');
    }

    return usersInventory;
  }

  async findUsersInventoryByUserId(userId: string) {
    let usersInventory;

    try {
      usersInventory = await this.usersInventoryModel
        .findOne({ userId: new RegExp(userId, 'i') })
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your inventory.');
    }

    if (!usersInventory) {
      throw new NotFoundException('Could not find your inventory.');
    }

    return {
      id: usersInventory._id.toHexString(),
      userId: usersInventory.userId,
      refrigerator: usersInventory.refrigerator,
      freezer: usersInventory.freezer,
      pantry: usersInventory.pantry,
      others: usersInventory.others
    };
  }
}
