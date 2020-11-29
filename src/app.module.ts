/*
  Default imports.
*/
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/*
  Mongoose provides a straight-forward, schema-based solution to model your application data.
  It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
*/
import { MongooseModule } from '@nestjs/mongoose';

/*
  Config.
*/

import { ConfigModule } from './config/config.module';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';

/*
  API modules.
  */

import { UtilsModule } from './shared/utils/utils.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ScannerModule } from './controllers/scanner/scanner.module';
import { UsersInfoModule } from './controllers/users-info/users-info.module';
import { UsersInventoryModule } from './controllers/users-inventory/users-inventory.module';
import { RecipesBookModule } from './controllers/recipesBook/recipesBook.module';
import { RecipesModule } from './controllers/recipes/recipes.module';
import { ShoppingListModule } from './controllers/shoppingList/shoppingList.module';
import { ProductModule } from './controllers/product/product.module';
import { IngredientModule } from './controllers/ingredient/ingredient.module';
import { CategoryModule } from './controllers/category/category.module';
import { PreferenceModule } from './controllers/preference/preference.module';
import { AllergyModule } from './controllers/allergy/allergy.module';
import { NutrientModule } from './controllers/nutrient/nutrient.module';
import { TokensModule } from './controllers/tokens/tokens.module';
import { UsersTimelineModule } from './controllers/users-timeline/users-timeline.module';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UtilsModule,
    ScannerModule,
    UsersInfoModule,
    UsersInventoryModule,
    UsersTimelineModule,
    RecipesBookModule,
    RecipesModule,
    ShoppingListModule,
    ProductModule,
    IngredientModule,
    CategoryModule,
    PreferenceModule,
    AllergyModule,
    NutrientModule,
    TokensModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${
        process.env.DB_PASSWORD
      }@reciptory-rnyie.mongodb.net/reciptory-db?retryWrites=true&w=majority`
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  port: number;
  constructor(_configService: ConfigService) {
    this.port = +process.env.PORT || +_configService.get(Configuration.PORT);
  }
}
