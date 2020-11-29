import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeSchema } from './schemas/recipe.schema';

// Outsider services.
import { UsersInfoService } from '../users-info/users-info.service';
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { UsersTimelineService } from '../users-timeline/users-timeline.service';
import { RecipesBookService } from '../recipesBook/recipesBook.service';
import { ProductService } from '../product/product.service';

// Outsider schemas.
import { UsersInfoSchema } from '../users-info/schemas/usersInfo.schema';
import { UsersInventorySchema } from '../users-inventory/schemas/users-inventory.schema';
import { RecipesBookSchema } from '../recipesBook/schemas/recipesBook.schema';
import { ProductSchema } from '../product/schemas/product.schema';
import { UsersTimelineSchema } from '../users-timeline/schemas/users-timeline.schema';

@Module({
  /*
    For every module in our server we must import MongooseModule.
    Mongoose provides a forFeature function which takes an array of "schema wrappers".
    An schema wrapper is a JSO which has at least a name and a reference to a schema.
  */
  imports: [
    MongooseModule.forFeature([
      { name: 'Recipe', schema: RecipeSchema },
      { name: 'UsersInfo', schema: UsersInfoSchema },
      { name: 'UsersInventory', schema: UsersInventorySchema },
      { name: 'UsersTimeline', schema: UsersTimelineSchema },
      { name: 'RecipesBook', schema: RecipesBookSchema },
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    UsersInfoService,
    UsersInventoryService,
    UsersTimelineService,
    RecipesBookService,
    ProductService
  ]
})
export class RecipesModule {}
