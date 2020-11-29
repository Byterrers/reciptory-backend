import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UsersInventoryController } from './users-inventory.controller';
import { UsersInventoryService } from './users-inventory.service';
import { UsersInventorySchema } from './schemas/users-inventory.schema';

// Outsider services.
import { ProductService } from '../product/product.service';

// Outsider schemas.
import { ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UsersInventory', schema: UsersInventorySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [UsersInventoryController],
  providers: [UsersInventoryService, ProductService]
})
export class UsersInventoryModule {}
