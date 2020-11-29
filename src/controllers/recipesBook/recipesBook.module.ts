import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecipesBookController } from './recipesBook.controller';
import { RecipesBookService } from './recipesBook.service';
import { RecipesBookSchema } from './schemas/recipesBook.schema';

// Outsider services.
import { RecipesService } from '../recipes/recipes.service';
import { UsersInfoService } from '../users-info/users-info.service';
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { UsersTimelineSchema } from '../users-timeline/schemas/users-timeline.schema';
import { ProductService } from '../product/product.service';

// Outsider schemas.
import { RecipeSchema } from '../recipes/schemas/recipe.schema';
import { UsersInfoSchema } from '../users-info/schemas/usersInfo.schema';
import { UsersInventorySchema } from '../users-inventory/schemas/users-inventory.schema';
import { UsersTimelineService } from '../users-timeline/users-timeline.service';
import { ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RecipesBook', schema: RecipesBookSchema },
      { name: 'Recipe', schema: RecipeSchema },
      { name: 'UsersInfo', schema: UsersInfoSchema },
      { name: 'UsersInventory', schema: UsersInventorySchema },
      { name: 'UsersTimeline', schema: UsersTimelineSchema },
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [RecipesBookController],
  providers: [
    RecipesBookService,
    RecipesService,
    UsersInfoService,
    UsersInventoryService,
    UsersTimelineService,
    ProductService
  ]
})
export class RecipesBookModule {}
