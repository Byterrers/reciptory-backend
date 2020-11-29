import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSchema } from './schemas/auth.schema';

// Outsider services.
import { UsersInfoService } from '../users-info/users-info.service';
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { UsersTimelineService } from '../users-timeline/users-timeline.service';
import { RecipesBookService } from '../recipesBook/recipesBook.service';
import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { ProductService } from '../product/product.service';

// Outsider schemas.
import { UsersInfoSchema } from '../users-info/schemas/usersInfo.schema';
import { UsersInventorySchema } from '../users-inventory/schemas/users-inventory.schema';
import { UsersTimelineSchema } from '../users-timeline/schemas/users-timeline.schema';
import { RecipesBookSchema } from '../recipesBook/schemas/recipesBook.schema';
import { RecipeSchema } from '../recipes/schemas/recipe.schema';
import { ShoppingListSchema } from '../shoppingList/schemas/shoppingList.schema';
import { ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Auth', schema: AuthSchema },
      { name: 'UsersInfo', schema: UsersInfoSchema },
      { name: 'UsersInventory', schema: UsersInventorySchema },
      { name: 'UsersTimeline', schema: UsersTimelineSchema },
      { name: 'RecipesBook', schema: RecipesBookSchema },
      { name: 'Recipe', schema: RecipeSchema },
      { name: 'ShoppingList', schema: ShoppingListSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_configService: ConfigService) => {
        return {
          secret: _configService.get(Configuration.JWT_SECRET),
          // signOptions: { expiresIn: '7200s' }
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    JWTStrategy,
    UsersInfoService,
    UsersInventoryService,
    UsersTimelineService,
    RecipesBookService,
    RecipesService,
    ShoppingListService,
    ProductService
  ],
  exports: [AuthService, JWTStrategy],
})
export class AuthModule {}
