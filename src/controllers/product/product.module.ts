import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema } from './schemas/product.schema';

// Outsider services.
import { UsersInventoryService } from '../users-inventory/users-inventory.service';

// Outsider schemas.
import { UsersInventorySchema } from '../users-inventory/schemas/users-inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: 'Product', schema: ProductSchema },
    { name: 'UsersInventory', schema: UsersInventorySchema }
    ]),
  ],
  providers: [ProductService, UsersInventoryService],
  controllers: [ProductController]
})
export class ProductModule {}
