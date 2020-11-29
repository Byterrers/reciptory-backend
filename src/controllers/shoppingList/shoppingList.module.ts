import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShoppingListController } from './shoppingList.controller';
import { ShoppingListService } from './shoppingList.service';
import { ShoppingListSchema } from './schemas/shoppingList.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ShoppingList', schema: ShoppingListSchema },
    ]),
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}
