import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';
import { AllergySchema } from './schemas/allergy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Allergy', schema: AllergySchema },
    ]),
  ],
  providers: [AllergyService],
  controllers: [AllergyController]
})
export class AllergyModule {}
