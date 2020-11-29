import { IUsersInventory } from '../interfaces/users-inventory.interface';

export class UsersInventoryModel implements IUsersInventory {
  userId: string;
  refrigerator: string[];
  freezer: string[];
  pantry: string[];
  others: string[];

  constructor() {}
}
