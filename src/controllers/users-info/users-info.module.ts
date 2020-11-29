import { Module } from '@nestjs/common';
import { UsersInfoSchema } from './schemas/usersInfo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersInfoController } from './users-info.controller';
import { UsersInfoService } from './users-info.service';

// Outsider services.
// import { ShoppingListService } from '../shoppingList/shoppingList.service';

// Outsider schemas.
// import { ShoppingListSchema } from '../shoppingList/schemas/shoppingList.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UsersInfo', schema: UsersInfoSchema }
      // { name: 'ShoppingList', schema: ShoppingListSchema },
    ])
  ],
  controllers: [UsersInfoController],
  providers: [
    UsersInfoService
    // ShoppingListService
  ]
})
export class UsersInfoModule {}
