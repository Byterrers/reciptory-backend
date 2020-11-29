import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NutrientController } from './nutrient.controller';
import { NutrientService } from './nutrient.service';
import { NutrientSchema } from './schemas/nutrient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Nutrient', schema: NutrientSchema },
    ]),
  ],
  providers: [NutrientService],
  controllers: [NutrientController]
})
export class NutrientModule {}
